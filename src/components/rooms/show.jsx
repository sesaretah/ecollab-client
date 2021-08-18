import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import $ from 'jquery';
import Header from "../header/header.jsx";
import Janus from "../../janus.js";
import { conf } from "../../conf";
import { socket } from '../../socket.js'
import { v4 as uuidv4 } from 'uuid';

import {
  sessionCreate, addParticipant, exisitingParticipant, registerUsername,
  toggleMute, exitAudioRoom, removeParticipant, participantChangeStatus,
  participantDisplay, forceMute, participantChangeRoom, currentRole,
} from "./janus-tools.js";

import {
  vsessionCreate, vregisterUsername, vNewRemoteFeed, publishCamera,
  toggleCamera, vStreamAttacher, vStreamDettacher, unPublishCamera,
  vChangeUsername, vAddParticipant, toggleVideoDevice, exitVideoRoom
} from "./janus-videoroom.js";

import {
  dishArea, disher, setWidth
} from "./dish.js";

import {
  socketHandle, appendChat, chatItems, throttle, send, wsSend, keydownHandler, scrollChat
} from "../rooms/chat.js";

const t = dict['fa']

export default class MeetingShow extends React.Component {

  constructor(props) {
    super(props);
    this.getInstance = this.getInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setInstance = this.setInstance.bind(this);


    this.vsessionCreate = vsessionCreate.bind(this)
    this.vregisterUsername = vregisterUsername.bind(this)
    this.vNewRemoteFeed = vNewRemoteFeed.bind(this)
    this.publishCamera = publishCamera.bind(this)
    this.toggleCamera = toggleCamera.bind(this)
    this.vStreamAttacher = vStreamAttacher.bind(this)
    this.vStreamDettacher = vStreamDettacher.bind(this)
    this.unPublishCamera = unPublishCamera.bind(this)
    this.vChangeUsername = vChangeUsername.bind(this)
    this.vAddParticipant = vAddParticipant.bind(this)
    this.toggleVideoDevice = toggleVideoDevice.bind(this)
    this.exitVideoRoom = exitVideoRoom.bind(this);

    this.currentRole = currentRole.bind(this)

    this.sessionCreate = sessionCreate.bind(this);
    this.registerUsername = registerUsername.bind(this);
    this.participantChangeStatus = participantChangeStatus.bind(this);
    this.participantDisplay = participantDisplay.bind(this);
    this.forceMute = forceMute.bind(this);
    this.participantChangeRoom = participantChangeRoom.bind(this);
    this.exitAudioRoom = exitAudioRoom.bind(this);
    this.removeParticipant = removeParticipant.bind(this);
    this.addParticipant = addParticipant.bind(this);
    this.toggleMute = toggleMute.bind(this);
    this.exisitingParticipant = exisitingParticipant.bind(this);

    this.dishArea = dishArea.bind(this);
    this.disher = disher.bind(this);
    this.setWidth = setWidth.bind(this);

    this.socketHandle = socketHandle.bind(this);
    this.appendChat = appendChat.bind(this);
    this.chatItems = chatItems.bind(this);
    this.throttle = throttle.bind(this);
    this.send = send.bind(this);
    this.wsSend = wsSend.bind(this);
    this.keydownHandler = keydownHandler.bind(this);
    this.scrollChat = scrollChat.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),

      name: null,
      fullname: null,
      userUUID: null,
      initials: null,
      is_speaker: false,
      is_moderator: false,
      is_presenter: false,
      role: null,
      talking: {},

      opaqueId: "videoroomtest-" + Janus.randomString(12),
      mixertest: null,
      server: conf.janusServer,
      roomId: null,
      pin: null,

      participants: [],
      vparticipants: [],

      muted: true,
      talking: false,
      myId: null,
      vroomId: null,
      vpin: null,

      janus: null,
      sfutest: null,
      feeds: [],
      propagates: [],

      chats: [],
      lastTime: Date.now(),
      content: null,
      item: null,
    }

  }



  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("deleted_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("deleted_instance", this.getInstance);
    window.localStorage.setItem(this.state.roomId, 'unchoke')
    this.exitAll();
  }

  exitAll() {
    this.exitAudioRoom();
    this.exitVideoRoom();
  }

  componentDidMount() {

    var self = this;
    if (this.state.token && this.state.token.length > 10) {
      MyActions.setInstance('users/validate_token', {}, this.state.token);
    }
    window.addEventListener("load", function (event) {
      self.disher();
      window.onresize = disher;
    }, false);

    socket.on('connect', function () {
      if (self.state.roomId) {
        socket.emit('room', { room: self.state.roomId.toString(), uuid: self.state.userUUID });
      }
    });

    socket.on('message', function (data) {
      if (data['sender'] !== self.state.userUUID) {
        self.socketHandle(data)
      }
    });

    if (!window.localStorage.getItem(this.state.roomId)) {
      window.localStorage.setItem(this.state.roomId, 'unchoke')
    }

    window.onunload = window.onbeforeunload = function () {
      window.localStorage.setItem(this.state.roomId, 'unchoke')
    }
  }


  handleChange(obj) {
    this.setState(obj);
  }

  getInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Room') {
      this.setState({
        roomId: model.uuid,
        pin: model.pin,
        secret: model.secret,
        vroomId: model.vuuid,
        vpin: model.vpin,
        is_speaker: model.is_speaker,
        is_moderator: model.is_moderator,
        is_presenter: model.is_presenter,
      }, () => {
        console.log(this.state)
        this.sessionCreate(this.state.roomId)
        this.vsessionCreate(this.state.vroomId)
        if (window.localStorage.getItem(this.state.roomId) === 'unchoke') {
          window.localStorage.setItem(this.state.roomId, 'choke')
          console.log('Reloading ....')
          window.location.reload();
        }

        this.connectSocketRoom();
      })
    }
  }

  setInstance() {
    var self = this;
    var klass = ModelStore.getKlass()
    var user = ModelStore.getIntance();
    if (klass === 'Validate') {
      this.setState({ name: user.name, fullname: user.name, initials: user.initials, userUUID: user.uuid }, () => {
        console.log(self.state)
        MyActions.getInstance('rooms', self.props.match.params.id, self.state.token);
      });
    }
  }

  presentBtn() {
    if (this.state.is_presenter || this.state.is_moderator) {
      return (
        <a class="m-1" onClick=''>
          <span class="avatar" style={{ backgroundColor: '#d7d8da' }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 4h4v4" /><path d="M16 9l5 -5" /></svg>
          </span>
        </a>
      )
    }
  }

  cameraBtn() {
    if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
      return (
        <a class="m-1" onClick={() => this.toggleMute()}>
          <span class="avatar" style={{ backgroundColor: '#d7d8da' }}>
            <svg id='microphone-on' style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            <svg id='microphone-off' style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="3" x2="21" y2="21" /><path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" /><path d="M5 10a7 7 0 0 0 10.846 5.85m2.002 -2a6.967 6.967 0 0 0 1.152 -3.85" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          </span>
        </a>
      )
    }
  }

  microphoneBtn() {
    if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
      return (
        <a class="m-1" onClick={() => this.toggleCamera()}>
          <span class="avatar" style={{ backgroundColor: '#d7d8da' }}>
            <div id='camera-spinner' class="spinner-border text-red" role="status" style={{ display: 'none' }}></div>
            <svg id='camera-on' style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="10" r="7" /><circle cx="12" cy="10" r="3" /><path d="M8 16l-2.091 3.486a1 1 0 0 0 .857 1.514h10.468a1 1 0 0 0 .857 -1.514l-2.091 -3.486" /></svg>
            <svg id='camera-off' style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.15 6.153a7 7 0 0 0 9.696 9.696m2.003 -2.001a7 7 0 0 0 -9.699 -9.695" /><path d="M9.13 9.122a3 3 0 0 0 3.743 3.749m2.001 -2.009a3 3 0 0 0 -3.737 -3.736" /><path d="M8 16l-2.091 3.486a1 1 0 0 0 .857 1.514h10.468a1 1 0 0 0 .857 -1.514l-2.091 -3.486" /><line x1="3" y1="3" x2="21" y2="21" /></svg>
          </span>
        </a>
      )
    }
  }

  settingsBtn() {
    if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
      return (
        <a class="m-1" onClick=''>
          <span class="avatar" style={{ backgroundColor: '#d7d8da' }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><circle cx="12" cy="12" r="3" /></svg>
          </span>
        </a>
      )
    }
  }

  exitBtn() {
    return (
      <a class="m-1" onClick={() => this.exitAll()}>
        <span class="avatar" style={{ backgroundColor: '#d7d8da' }}>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
        </span>
      </a>
    )
  }

  controls() {
    return (
      <div class="card card-active mb-3" >
        <div class="card-body p-1" style={{ textAlign: 'center' }}>
          {this.microphoneBtn()}
          {this.cameraBtn()}
          {this.presentBtn()}
          {this.settingsBtn()}
          {this.exitBtn()}
        </div>
      </div>
    )
  }

  showControl() {
    if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
      return (this.controls())
    }
  }

  talkingIndicator(id) {
    if (this.state.talking[id]) {
      return (<span class="badge bg-yellow"></span>)
    }
  }

  speakerList() {
    var result = []
    this.state.participants.map((participant) => {
      if (participant.role !== 'listener') {
        result.push(
          <div class="col-6 mb-1">
            <div class="row g-3 align-items-center">
              <span class="avatar avatar-sm">
                {participant.initials}
                {this.talkingIndicator(participant.id)}
              </span>
              <div class="col text-truncate">
                <span class="chat-title">{participant.display}</span>
                <div class="form-hint mt-n1">{t[participant.role]}</div>
              </div>
            </div>
          </div>
        )
      }
    })
    return result
  }

  listenerList() {
    var result = []
    this.state.participants.map((participant) => {
      if (participant.role === 'listener') {
        result.push(
          <div class="col-6 mb-1">
            <div class="row g-3 align-items-center">
              <a href="#" class="col-auto">
                <span class="avatar avatar-sm">
                  {participant.initials}
                  {this.talkingIndicator(participant.id)}
                </span>
              </a>
              <div class="col text-truncate">
                <span class="chat-title">{participant.display}</span>
                <div class="form-hint mt-n1">{t[participant.role]}</div>
              </div>
            </div>
          </div>
        )
      }
    })
    return result
  }




  connectSocketRoom() {
    if (this.state.userUUID && this.state.roomId) {
      socket.emit('room', { room: this.state.roomId, uuid: this.state.userUUID });
    }
  }


  render() {
    const t = dict['fa']
    return (
      <body className="antialiased">
        <div className="wrapper">
          <Header history={this.props.history} />
          <div className="page-wrapper">
            <div className="page-body pt-2">
              <div className="container-fluid">
                <div className="row  row-cards">


                  <div class="col-lg-4">
                    {this.showControl()}
                    <div class="card mb-3 maxh-250 ">
                    <div class="card-status-top bg-danger"></div>
                      <div class="card-body pt-2 pb-1" style={{ overflowY: 'scroll' }}>
                        <div class="row">
                          {this.speakerList()}
                        </div>
                      </div>
                    </div>

                    <div class="card mb-3 maxh-250">
                    <div class="card-status-top bg-blue"></div>
                      <div class="card-body pt-1 pb-1" style={{ overflowY: 'scroll' }}>
                        <div class="row">
                          {this.listenerList()}
                        </div>
                      </div>
                    </div>

                    <div class="card mb-3 maxh-350 minh-350">
                      <div class="list-group list-group-flush overflow-auto" id='chat-box' style={{ maxHeight: '25rem' }}>
                        {this.chatItems()}
                      </div>
                      <div class="card-footer bg-dark">
                        <div class="row">
                          <div class="col">
                            <textarea id='chat-form' class="form-control" data-bs-toggle="autosize" placeholder={t['write_something']} onChange={(e) => {
                              this.handleChange({ item: { content: e.target.value, name: this.state.name, initials: this.state.initials, time: Date.now(), uuid: uuidv4() } })
                            }} />
                          </div>
                          <div class="col-auto">
                            <a onClick={() => this.send()} class="btn  btn-icon" aria-label="Button">
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="10" y1="14" x2="21" y2="3" /><path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-8">
                    <div class="card">
                      <div class="card-body" id='content' style={{ height: '500px' }}>
                        <div id="Dish">

                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div id='mixedaudio' style={{ display: 'block' }}></div>
        </div>

      </body >
    )
  }
}




