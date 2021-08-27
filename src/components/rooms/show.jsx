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
  participantDisplay, forceMute, participantChangeRoom, currentRole, changeUsername,
  changeParticipant, changeOwn,
} from "./janus-tools.js";

import {
  vsessionCreate, vregisterUsername, vNewRemoteFeed, publishCamera,
  toggleCamera, vStreamAttacher, vStreamDettacher, unPublishCamera,
  vChangeUsername, vAddParticipant, toggleVideoDevice, exitVideoRoom,
  listParticipants, vremoveParticipant, vChangeOwn
} from "./janus-videoroom.js";

import {
  scSessionCreate, scRegisterUsername, scNewRemoteFeed, publishScreen,
  toggleScreen, scStreamAttacher, scStreamDettacher, unPublishScreen,
  scAddParticipant, exitScreenRoom
} from "./janus-screenroom.js";

import {
  dishArea, disher, setWidth
} from "./dish.js";

import {
  appendChat, chatItems, throttle, send, wsSend, keydownHandler, scrollChat,
  handRaiseCreate, handRaiseDestroy, isHandRaised
} from "../rooms/chat.js";

const t = dict['fa']

export default class MeetingShow extends React.Component {

  constructor(props) {
    super(props);
    this.getInstance = this.getInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handRaiseToggle = this.handRaiseToggle.bind(this);
    this.initDevices = this.initDevices.bind(this);

    this.vsessionCreate = vsessionCreate.bind(this)
    this.vregisterUsername = vregisterUsername.bind(this)
    this.vNewRemoteFeed = vNewRemoteFeed.bind(this)
    this.publishCamera = publishCamera.bind(this)
    this.toggleCamera = toggleCamera.bind(this)
    this.vStreamAttacher = vStreamAttacher.bind(this)
    this.vStreamDettacher = vStreamDettacher.bind(this)
    this.vremoveParticipant = vremoveParticipant.bind(this)
    this.unPublishCamera = unPublishCamera.bind(this)
    this.vChangeUsername = vChangeUsername.bind(this)
    this.vAddParticipant = vAddParticipant.bind(this)
    this.toggleVideoDevice = toggleVideoDevice.bind(this)
    this.exitVideoRoom = exitVideoRoom.bind(this);
    this.changeUsername = changeUsername.bind(this);
    this.listParticipants = listParticipants.bind(this);
    this.vChangeOwn = vChangeOwn.bind(this);

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
    this.changeParticipant = changeParticipant.bind(this);
    this.changeOwn = changeOwn.bind(this);
    this.handRaiseCreate = handRaiseCreate.bind(this);
    this.handRaiseDestroy = handRaiseDestroy.bind(this);
    this.isHandRaised = isHandRaised.bind(this);

    this.scSessionCreate = scSessionCreate.bind(this);
    this.scRegisterUsername = scRegisterUsername.bind(this);
    this.scNewRemoteFeed = scNewRemoteFeed.bind(this);
    this.publishScreen = publishScreen.bind(this);
    this.toggleScreen = toggleScreen.bind(this);
    this.scStreamAttacher = scStreamAttacher.bind(this);
    this.scStreamDettacher = scStreamDettacher.bind(this);
    this.unPublishScreen = unPublishScreen.bind(this);
    this.scAddParticipant = scAddParticipant.bind(this);
    this.exitScreenRoom = exitScreenRoom.bind(this);

    this.dishArea = dishArea.bind(this);
    this.disher = disher.bind(this);
    this.setWidth = setWidth.bind(this);


    this.appendChat = appendChat.bind(this);
    this.chatItems = chatItems.bind(this);
    this.throttle = throttle.bind(this);
    this.send = send.bind(this);
    this.wsSend = wsSend.bind(this);
    this.keydownHandler = keydownHandler.bind(this);
    this.scrollChat = scrollChat.bind(this);

    this.socketHandle = this.socketHandle.bind(this);
    this.handleChangedRole = this.handleChangedRole.bind(this)

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

      handRaised: [],
      myHand: false,
      sourceSettings: false,

      opaqueId: "videoroomtest-" + Janus.randomString(12),
      mixertest: null,
      server: conf.janusServer,
      roomId: null,
      pin: null,
      id: null,

      participants: [],
      vparticipants: [],
      scParticipants: [],

      muted: true,
      talking: false,
      myId: null,
      vroomId: null,
      vpin: null,

      scRoomId: 1234,
      scPin: null,
      scJanus: null,
      scSfutest: null,
      scFeeds: [],

      janus: null,
      sfutest: null,
      feeds: [],
      propagates: [],

      chats: [],
      lastTime: Date.now(),
      content: null,
      item: null,

      speakerDevices: [],
      microphoneDevices: [],
      cameraDevices: [],

      isSata: false,
      slot: 1,
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
      console.log('message', data)
      if (data['sender'] !== self.state.userUUID) {
        self.socketHandle(data)
      }
    });

    this.initDevices();

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

  initDevices() {
    var self = this;
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          console.log(device.kind)
          if (device.kind === 'audiooutput') {
            self.setState({ speakerDevices: self.state.speakerDevices.concat({ id: device.deviceId, label: device.label }) })
          }
          if (device.kind === 'audioinput') {
            self.setState({ microphoneDevices: self.state.microphoneDevices.concat({ id: device.deviceId, label: device.label }) }, () => console.log(self.state.microphoneDevices))
          }
          if (device.kind === 'videoinput') {
            self.setState({ cameraDevices: self.state.cameraDevices.concat({ id: device.deviceId, label: device.label }) })
          }
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }

  socketHandle(msg) {
    var self = this;
    var parsed = msg;
    switch (parsed.type) {
      case "chat":
        self.appendChat(parsed.c);
        break;
      case "changeRole":
        self.handleChangedRole(parsed.c);
        break;
      case "handRaise":
        self.handRaiseCreate(parsed.c);
        break;
      case "handDown":
        self.handRaiseDestroy(parsed.c);
        break;
      case "userCounter":
        self.setState({ userCounter: parsed.c });
        break;
    }
  }

  handleChangedRole(c) {
    var self = this;
    var uuid = c.uuid;
    var role = c.role;
    if (uuid == self.state.userUUID) {
      if (role === "listener") {
        self.setState(
          { is_speaker: false, is_presenter: false, is_moderator: false },
          () => {
            //self.changeUsername(self.state.roomId);
            self.vChangeUsername(self.state.vroomId)
          }
        );
      }
      if (role === "speaker") {
        self.setState(
          { is_speaker: true, is_presenter: false, is_moderator: false },
          () => {
            self.vChangeUsername(self.state.roomId);
          }
        );
      }
      if (role === "presenter") {
        self.setState(
          { is_presenter: true, is_speaker: false, is_moderator: false },
          () => {
            self.vChangeUsername(self.state.roomId);
          }
        );
      }
      if (role === "moderator") {
        self.setState(
          { is_moderator: true, is_speaker: false, is_presenter: false },
          () => {
            self.vChangeUsername(self.state.roomId);
          }
        );
      }
    }
  }


  getInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Room') {
      this.setState({
        id: model.id,
        roomId: model.uuid,
        pin: model.pin,
        secret: model.secret,
        vroomId: model.vuuid,
        vpin: model.vpin,
        is_speaker: model.is_speaker,
        is_moderator: model.is_moderator,
        is_presenter: model.is_presenter,
        isSata: model.is_sata,
      }, () => {
        this.sessionCreate(this.state.roomId)
        this.vsessionCreate(this.state.vroomId)
        this.scSessionCreate(1234)
        if (window.localStorage.getItem(this.state.roomId) === 'unchoke') {
          window.localStorage.setItem(this.state.roomId, 'choke')
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
        <a class="m-10p" onClick={() => this.toggleScreen()}>
          <span class="avatar avatar-mini" style={{ backgroundColor: '#d7d8da' }}>
            <div id='screen-spinner' class="spinner-border text-red" role="status" style={{ display: 'none' }}></div>
            <svg id='screen-on' style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 8l4 -4m-4 0l4 4" /></svg>
            <svg id='screen-off' style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 4h4v4" /><path d="M16 9l5 -5" /></svg>
          </span>
        </a>
      )
    }
  }

  microphoneBtn() {
    if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
      return (
        <a class="m-10p" onClick={() => this.toggleMute()}>
          <span class="avatar avatar-mini" style={{ backgroundColor: '#d7d8da' }}>
            <svg id='microphone-off' style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            <svg id='microphone-on' style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="3" x2="21" y2="21" /><path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" /><path d="M5 10a7 7 0 0 0 10.846 5.85m2.002 -2a6.967 6.967 0 0 0 1.152 -3.85" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          </span>
        </a>
      )
    }
  }

  cameraBtn() {
    if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
      return (
        <a class="m-10p" onClick={() => this.toggleCamera()}>
          <span class="avatar avatar-mini" style={{ backgroundColor: '#d7d8da' }}>
            <div id='camera-spinner' class="spinner-border text-red" role="status" style={{ display: 'none' }}></div>
            <svg id='camera-off' style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="10" r="7" /><circle cx="12" cy="10" r="3" /><path d="M8 16l-2.091 3.486a1 1 0 0 0 .857 1.514h10.468a1 1 0 0 0 .857 -1.514l-2.091 -3.486" /></svg>
            <svg id='camera-on' style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.15 6.153a7 7 0 0 0 9.696 9.696m2.003 -2.001a7 7 0 0 0 -9.699 -9.695" /><path d="M9.13 9.122a3 3 0 0 0 3.743 3.749m2.001 -2.009a3 3 0 0 0 -3.737 -3.736" /><path d="M8 16l-2.091 3.486a1 1 0 0 0 .857 1.514h10.468a1 1 0 0 0 .857 -1.514l-2.091 -3.486" /><line x1="3" y1="3" x2="21" y2="21" /></svg>
          </span>
        </a>
      )
    }
  }

  settingsBtn() {
    if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
      return (
        <React.Fragment>

          <a class="m-10p" onClick={() => this.toggleSettings()}>
            <span class="avatar avatar-mini" style={{ backgroundColor: '#d7d8da' }}>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><circle cx="12" cy="12" r="3" /></svg>
            </span>
          </a>
        </React.Fragment>
      )
    }
  }

  handRaiseBtn() {
    if (!this.state.is_moderator) {
      return (
        <a class="m-10p" onClick={() => this.handRaiseToggle()}>
          <span class="avatar avatar-mini" style={{ backgroundColor: '#d7d8da' }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5" /><path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" /></svg>
          </span>
        </a>
      )
    }
  }

  exitBtn() {
    return (
      <a class="m-10p" onClick={() => this.exitAll()}>
        <span class="avatar avatar-mini" style={{ backgroundColor: '#d7d8da' }}>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
        </span>
      </a>
    )
  }

  controls() {
    return (
      <div class="card card-active mb-3" >
        <div class="card-body p-0 py-1" style={{ textAlign: 'center' }}>
          {this.microphoneBtn()}
          {this.cameraBtn()}
          {this.presentBtn()}
          {this.settingsBtn()}
          {this.handRaiseBtn()}
        </div>
      </div>
    )
  }

  showControl() {
    // if (this.state.is_moderator || this.state.is_presenter || this.state.is_speaker) {
    return (this.controls())
    // }
  }

  talkingIndicator(id) {
    if (this.state.talking[id]) {
      return (<span class="badge bg-yellow"></span>)
    }
  }

  handRaiseToggle() {
    if (!this.state.myHand) {
      this.setState({ myHand: true }, () => {
        this.handRaiseCreate({ uuid: this.state.userUUID })
        this.wsSend({ type: 'handRaise', c: { uuid: this.state.userUUID } })
      })
    } else {
      this.setState({ myHand: false }, () => {
        this.handRaiseDestroy({ uuid: this.state.userUUID })
        this.wsSend({ type: 'handDown', c: { uuid: this.state.userUUID } })
      })
    }
  }

  speakerList() {
    var result = []
    this.state.participants.map((participant) => {
      if (participant.role === 'moderator' || participant.role === 'presenter') {
        result.push(
          <div class="col-6 mb-1">
            <div class="row g-3 align-items-center">
              <span class="avatar avatar-sm">
                {participant.initials}
                {this.talkingIndicator(participant.id)}
                {this.handRaiseIndicator(participant)}
              </span>
              <div class="col text-truncate">
                <span class=" chat-title">{participant.display}</span>
                {this.roleSelect(participant)}
              </div>
            </div>
          </div>
        )
      }
    })
    return result
  }

  handRaiseIndicator(participant) {
    if (this.isHandRaised(participant.uuid)) {
      return (
        <span class="badge bg-yellow">
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '12px' }} width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5" /><path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" /></svg>
        </span>
      )
    }
  }

  listenerList() {
    var result = []
    this.state.participants.map((participant) => {
      if (participant.role === 'listener' || participant.role === 'speaker') {
        result.push(
          <div class="col-6 mb-1">
            <div class="row g-3 align-items-center">
              <span class="avatar avatar-sm">
                {participant.initials}
                {this.handRaiseIndicator(participant)}
              </span>
              <div class="col text-truncate">
                <span class=" chat-title">{participant.display}</span>
                {this.roleSelect(participant)}
              </div>
            </div>
          </div>
        )
      }
    })
    return result
  }

  changeRole(uuid, e) {
    this.wsSend({ type: 'changeRole', c: { uuid: uuid, role: e } })
    //self.changeOwn(self.state.userUUID, role);
    MyActions.setInstance('attendances/change_duty', { room_id: this.state.id, uuid: uuid, duty: e }, this.state.token);
  }

  roleSelect(participant) {
    var role = participant.role
    if (this.state.is_moderator) {
      return (
        <div class="form-hint mb-1">
          <select class="form-select role-select" onChange={(e) => this.changeRole(participant.uuid, e.target.value)}>
            <option value="listener" selected={role === 'listener' ? true : false}>{t['listener']}</option>
            <option value="presenter" selected={role === 'presenter' ? true : false}>{t['presenter']}</option>
            <option value="speaker" selected={role === 'speaker' ? true : false}>{t['speaker']}</option>
            <option value="moderator" selected={role === 'moderator' ? true : false}>{t['moderator']}</option>
          </select>
        </div>
      )
    } else {
      return (<div class="form-hint mb-1 role-select">{t[participant.role]}</div>)
    }
  }

  connectSocketRoom() {

    if (this.state.userUUID && this.state.roomId) {
      socket.emit('room', { room: this.state.roomId, uuid: this.state.userUUID });
    }
  }

  toggleSettings() {
    if (this.state.sourceSettings) {
      $('#sourceSettings').hide()
      this.setState({ sourceSettings: false })
    } else {
      this.setState({ sourceSettings: true })
      $('#sourceSettings').show()
    }

  }

  deviceOptions(items) {
    var result = []
    items.map((device) => {
      result.push(<option value={device.deviceId}>{device.label}</option>)
    })
    return result
  }

  showSettings() {
    if (this.state.microphoneDevices.length > 0) {
      return (
        <div class="card mb-3" id='sourceSettings' style={{ display: 'none' }}>
          <div class="card-body">
            <div className="mb-2">
              <label class="form-label mb-0">Speaker</label>
              <select id='speakerSelect' class="form-select form-control" onChange=''>
                {this.deviceOptions(this.state.speakerDevices)}
              </select>
            </div>
            <div className="mb-2">
              <label class="form-label mb-0">Microphone</label>
              <select id='audioSourceSelect' class="form-select" onChange={(e) => this.changeRole(e.target.value)}>
                {this.deviceOptions(this.state.microphoneDevices)}
              </select>
            </div>
            <div className="mb-2">
              <label class="form-label mb-0">Webcam</label>
              <select id='videoSourceSelect' class="form-select" onChange={(e) => this.changeRole(e.target.value)}>
                {this.deviceOptions(this.state.cameraDevices)}
              </select>
            </div>
          </div>
        </div>
      )
    }
  }

  sataPages() {
    if (this.state.isSata && this.state.is_moderator) {
      return (
        <ul class="pagination ">
          <li class="page-item"><a class="page-link" href={"p.html?display=1&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>1</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=2&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>2</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=3&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>3</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=4&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>4</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=5&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>5</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=6&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>6</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=7&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>7</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=8&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>8</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=9&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>9</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=10&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>10</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=11&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>11</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=12&room_id="+this.state.vroomId+"&pin="+this.state.vpin} target='_blank'>12</a></li>
        </ul>
      )
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


                  <div class="col-lg-3">
                    <div className={this.state.isSata ? 'show-element' : 'hide-element'}>
                      <div class="card mb-3 p-1" >
                        <div class="card-body" style={{ height: '180px' }}>
                          <div id="myDish"></div>
                        </div>
                      </div>
                    </div>
                    {this.showControl()}
                    {this.showSettings()}
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
                      <div class="card-body pt-2 pb-1" style={{ overflowY: 'scroll' }}>
                        <div class="row">
                          {this.listenerList()}
                        </div>
                      </div>
                    </div>

                    <div class="card mb-3 maxh-350 minh-350">
                      <div className="card-header p-2 px-3 bg-dark-lt" style={{ fontSize: '12px', fontWeight: '600' }}>{t['chats']}</div>
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

                  <div class="col-lg-9 ">
                    <div class="row ">

                      <div class="col-lg-12 p-0"  >
                        <div class="card mb-2">
                          <div class="card-body p-1" id='content' style={{ minHeight: '580px' }}>
                            <div id="Dish">

                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-12 p-0" >
                        <div class="card ">
                          <div class="card-body p-1 " id='content' style={{ minHeight: '450px' }}>
                            <div class="my-auto" id="screen">
                              <a onClick={() => this.listParticipants()}>777777</a>
                            </div>
                          </div>
                        </div>
                        <div id='mixedaudio' style={{ display: 'block' }}></div>
                      </div>

                    </div>
                        {this.sataPages()}
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

      </body >
    )
  }
}




