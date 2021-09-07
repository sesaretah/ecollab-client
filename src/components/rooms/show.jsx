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
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import {
  sessionCreate, addParticipant, exisitingParticipant, registerUsername,
  toggleMute, exitAudioRoom, removeParticipant, participantChangeStatus,
  participantDisplay, forceMute, participantChangeRoom, currentRole, changeUsername,
  changeParticipant, changeOwn, joinAudioRoom, joinAudioRoomWOMic
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

var t = dict['farsi']

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
    this.joinAudioRoom = joinAudioRoom.bind(this);
    this.joinAudioRoomWOMic = joinAudioRoomWOMic.bind(this);


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

    this.broadcast = this.broadcast.bind(this)
    this.changeLayout = this.changeLayout.bind(this)

    this.state = {
      token: window.localStorage.getItem('token'),
      lang: window.localStorage.getItem('lang'),
      dir: window.localStorage.getItem('dir'),
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

      layoutCol: 12,
      errorMessage: null,

      speakerDevice: null,
      microphoneDevice: null,
      cameraDevice: null,

      theme: '',
      playSoundBtn: false,

      timer: 0,
      timerDuration: 120,
      timerPlaying: false,
      timerStarted: true,
      timerCard: false,
      pollCard: false,

      playingFiles: []
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
    document.body.classList.remove('theme-dark');
  }

  exitAll() {
    this.exitAudioRoom();
    this.exitVideoRoom();
  }

  componentDidMount() {
    t = dict[this.state.lang]
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

    $(window).on('resize', disher);
    $('#videoz').on('resize', disher);


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
          //console.log(device.kind)
          if (device.kind === 'audiooutput') {
            self.setState({ speakerDevices: self.state.speakerDevices.concat({ id: device.deviceId, label: device.label }) })
          }
          if (device.kind === 'audioinput') {
            self.setState({ microphoneDevices: self.state.microphoneDevices.concat({ id: device.deviceId, label: device.label }) })
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
      case "changeLayout":
        self.changeOwnLayout(parsed.c.x);
        break;
      case "handRaise":
        self.handRaiseCreate(parsed.c);
        break;
      case "handDown":
        self.handRaiseDestroy(parsed.c);
        break;
      case "toggleTimer":
        this.setState({ timerStarted: false, timerDuration: parsed.c.timerDuration }, () => {
          this.setState({ timerStarted: true });
        });
        break;
      case "startTimer":
        this.setState({ timerPlaying: true });
        break;
      case "stopTimer":
        this.setState({ timerPlaying: false });
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
        vsecret: model.vsecret,
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
        //console.log(self.state)
        MyActions.getInstance('rooms', self.props.match.params.id, self.state.token);
      });
    }
  }

  broadcast() {
    console.log('{}{}{}', this.state.feeds)
    var rtpforward = { "request": "rtp_forward", "room": parseInt(this.state.vroomId), "publisher_id": this.state.feeds[0].rfid, "host": "127.0.0.1", "audio_port": 10001, "video_port": 10003, "data_port": 5000, "secret": this.state.vsecret };
    this.state.sfutest.send({
      "message": rtpforward,
      success: function (result) {
        console.log(result);
      },
    });
  }

  playSound(fileName) {
    var self = this;
    var playFile = { "request": "play_file", "room": parseInt(this.state.roomId), "secret": this.state.secret, "filename": "/var/snap/janus-gateway/common/share/OPUS/" + fileName + ".opus", "loop": false };
    this.state.mixertest.send({
      "message": playFile,
      success: function (result) {
        self.setState({ playingFiles: self.state.playingFiles.concat({ fileName: fileName, fileId: result.file_id }) })
        console.log(result);
      },
    });
  }

  stopSound() {
    this.state.playingFiles.map((f) => {
      var stopFile = { "request": "stop_file", "room": parseInt(this.state.roomId), "secret": this.state.secret, "file_id": f.fileId };
      this.state.mixertest.send({
        "message": stopFile,
        success: function (result) {
          console.log(result);
        },
      });
    })
  }

  presentBtn() {
    if (this.state.is_presenter || this.state.is_moderator) {
      return (
        <a class="m-10p" onClick={() => this.toggleScreen()}>
          <span class="avatar avatar-mini avatar-ctl">
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
          <span class="avatar avatar-mini avatar-ctl">
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
          <span class="avatar avatar-mini avatar-ctl">
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
            <span class="avatar avatar-mini avatar-ctl">
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
          <span class="avatar avatar-mini avatar-ctl">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5" /><path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" /></svg>
          </span>
        </a>
      )
    }
  }

  exitBtn() {
    return (
      <a class="m-10p" onClick={() => this.exitAll()}>
        <span class="avatar avatar-mini avatar-ctl">
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

  changeOwnLayout(x) {
    if (x === 4) {
      this.setState({ layoutCol: 6, timerCard: true, pollCard: true }, () => {
        setTimeout(
          function () {
            this.disher('', "Dish", "Camera");
          }
            .bind(this),
          700
        );
      });

    }
    if (x === 2) {
      this.setState({ layoutCol: 6, timerCard: false, pollCard: false }, () => {
        setTimeout(
          function () {
            this.disher('', "Dish", "Camera");
          }
            .bind(this),
          700
        );
      });

    }
    if (x === 1) {
      this.setState({ layoutCol: 12, timerCard: false, pollCard: false }, () => {
        setTimeout(
          function () {
            this.disher('', "Dish", "Camera");
          }
            .bind(this),
          700
        );
      });
    }
  }

  changeLayout(x) {
    this.wsSend({ type: 'changeLayout', c: { uuid: this.state.userUUID, x: x } })
    this.changeOwnLayout(x);
  }

  toggleTheme() {
    if (this.state.theme !== '') {
      this.setState({ theme: '' })
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.add('theme-dark');
      this.setState({ theme: 'theme-dark' })
    }
  }


  layoutControl() {
    if (this.state.is_moderator) {
      return (
        <div class="card card-active card-danger mb-3" >
          <div class="card-body p-0 py-1" style={{ textAlign: 'center' }}>
            <a class="m-10p" onClick={() => this.changeLayout(2)}>
              <span class="avatar avatar-mini avatar-ctl" >
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
              </span>
            </a>

            <a class="m-10p" onClick={() => this.changeLayout(1)}>
              <span class="avatar avatar-mini avatar-ctl">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="4" width="16" height="6" rx="2" /><rect x="4" y="14" width="16" height="6" rx="2" /></svg>
              </span>
            </a>


            <a class="m-10p" onClick={() => this.changeLayout(4)}>
              <span class="avatar avatar-mini avatar-ctl">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>
              </span>
            </a>


            <a class="m-10p" onClick={() => this.toggleTheme()}>
              <span class="avatar avatar-mini avatar-ctl">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /><path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" /><path d="M19 11h2m-1 -1v2" /></svg>
              </span>
            </a>

          </div>
        </div>
      )
    }
  }

  adminControl() {
    if (this.state.is_moderator) {
      return (
        <div class="card card-active card-sucess mb-3" >
          <div class="card-body p-0 py-1" style={{ textAlign: 'center' }}>
            <a class="m-10p" onClick={() => this.togglePlaySound()}>
              <span class="avatar avatar-mini avatar-ctl" >
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 8a3 3 0 0 1 0 6" /><path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5" /><path d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8" /></svg>
              </span>
            </a>

            <a class="m-10p" onClick=''>
              <span class="avatar avatar-mini avatar-ctl">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="3" y="7" width="18" height="13" rx="2" /><polyline points="16 3 12 7 8 3" /></svg>
              </span>
            </a>


            <a class="m-10p" onClick=''>
              <span class="avatar avatar-mini avatar-ctl">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="19" x2="3.01" y2="19" /><path d="M7 19a4 4 0 0 0 -4 -4" /><path d="M11 19a8 8 0 0 0 -8 -8" /><path d="M15 19h3a3 3 0 0 0 3 -3v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -2.8 2" /></svg>
              </span>
            </a>


            <a class="m-10p" onClick=''>
              <span class="avatar avatar-mini avatar-ctl">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><rect x="8" y="11" width="8" height="5" rx="1" /><path d="M10 11v-2a2 2 0 1 1 4 0v2" /></svg>
              </span>
            </a>

          </div>
        </div>
      )
    }
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

  selectDevice(obj) {
    this.setState(obj, () => {
      if (Object.keys(obj)[0] === 'microphoneDevice') {
        this.joinAudioRoom();
      }
      if (Object.keys(obj)[0] === 'cameraDevice') {
        this.toggleCamera();
      }
    })
  }

  playList() {
    if (this.state.playSoundBtn) {
      return (
        <div class="card mb-3 ">
          <div class="card-status-top bg-success"></div>
          <div class="card-body">
            <h3 class="card-title">{t['play_sound']}
              <a onClick={() => this.stopSound()} class="btn btn-white btn-icon mx-1" aria-label="Button">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
              </a>
            </h3>
            <div class="row">
              <div className='btn-list'>
                <button type="button" class="btn" onClick={() => this.playSound('anthem-iran')}>
                  {t['anthem-iran']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('quran')}>
                  {t['quran']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('applause1')}>
                  {t['applause1']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('applause2')}>
                  {t['applause2']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('laugh')}>
                  {t['laugh']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('laughing')}>
                  {t['laughing']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('snoring')}>
                  {t['snoring']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('throat')}>
                  {t['throat']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('footsteps')}>
                  {t['footsteps']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('piano1')}>
                  {t['piano1']}
                </button>
                <button type="button" class="btn" onClick={() => this.playSound('piano2')}>
                  {t['piano2']}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  togglePlaySound() {
    if (this.state.playSoundBtn) {
      this.setState({ playSoundBtn: false })
    } else {
      this.setState({ playSoundBtn: true })
    }
  }

  showSettings() {
    if (this.state.microphoneDevices.length > 0) {
      return (
        <div class="card mb-3" id='sourceSettings' style={{ display: 'none' }}>
          <div class="card-body">
            <div className="mb-2">
              <label class="form-label mb-0">Microphone</label>
              <select id='audioSourceSelect' class="form-select" onChange={(e) => this.selectDevice({ microphoneDevice: e.target.value })}>
                {this.deviceOptions(this.state.microphoneDevices)}
              </select>
            </div>
            <div className="mb-2">
              <label class="form-label mb-0">Webcam</label>
              <select id='videoSourceSelect' class="form-select" onChange={(e) => this.selectDevice({ cameraDevice: e.target.value })}>
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
          <li class="page-item"><a class="page-link" href={"p.html?display=1&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>1</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=2&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>2</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=3&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>3</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=4&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>4</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=5&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>5</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=6&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>6</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=7&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>7</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=8&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>8</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=9&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>9</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=10&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>10</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=11&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>11</a></li>
          <li class="page-item"><a class="page-link" href={"p.html?display=12&room_id=" + this.state.vroomId + "&pin=" + this.state.vpin} target='_blank'>12</a></li>
        </ul>
      )
    }
  }

  webrtcAlerts() {
    if (this.state.errorMessage) {
      return (
        <div class="alert alert-important alert-warning alert-dismissible" role="alert">
          <div class="d-flex">
            <div>
            </div>
            <div>
              {t['error']}: {t[this.state.errorMessage] ? t[this.state.errorMessage] : this.state.errorMessage}
              <a className='mx-2 btn' onClick={() => this.justListen()}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 10a7 7 0 1 1 13 3.6a10 10 0 0 1 -2 2a8 8 0 0 0 -2 3a4.5 4.5 0 0 1 -6.8 1.4" /><path d="M10 10a3 3 0 1 1 5 2.2" /></svg>
                {t['just_listen_click']}
              </a>
            </div>
          </div>
          <a class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="close"></a>
        </div>
      )
    }
  }

  justListen() {
    document.getElementById('roomaudio').play();
    document.getElementById('roomaudio').muted = false;
  }

  renderTime() {

    if (this.state.timer === 0) {
      return <div className="timer">{t['ended']}</div>;
    } else {
      return (
        <div className="timer">
          <div className="text">{t['remaining']}</div>
          <div className="value">{this.state.timer}</div>
          <div className="text">{t['seconds']}</div>
        </div>
      );
    }
  };

  updateTimer(t) {
    if (this.state.timer !== t) {
      this.setState({ timer: t })
    }
  }

  timerShow() {
    if (this.state.timerStarted) {
      return (
        <CountdownCircleTimer
          isPlaying={this.state.timerPlaying}
          duration={parseInt(this.state.timerDuration)}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"], ["#A30000"]]}
          onComplete={() => this.setState({ timerPlaying: false })}
          renderAriaTime={(r) => this.updateTimer(r.remainingTime)}
        >
          {this.renderTime()}
        </CountdownCircleTimer>
      )
    }
  }

  toggleTimer() {
    this.setState({ timerStarted: false }, () => {
      this.setState({ timerStarted: true });
      this.wsSend({ type: 'toggleTimer', c: { uuid: this.state.userUUID, timerDuration: this.state.timerDuration } })
    })
  }

  stratTimer() {
    this.setState({ timerPlaying: true }, () => {
      this.wsSend({ type: 'startTimer', c: { uuid: this.state.userUUID } })
    })

  }

  stopTimer() {
    this.setState({ timerPlaying: false }, () => {
      this.wsSend({ type: 'stopTimer', c: { uuid: this.state.userUUID } })
    })
  }

  timerCard() {
    if (this.state.timerCard) {
      return (
        <div class={"col-lg-" + this.state.layoutCol + " p-1 eff-" + this.state.layoutCol} >
          <div class="card ">
            <div class="card-body" style={{ minHeight: '150px' }}>
              <div class="empty">
                <div class="row mb-3">
                  {this.timerShow()}
                </div>
                <div class="row">
                  <div class="col-auto">
                    <a onClick={() => this.toggleTimer()} class="btn btn-white btn-icon" aria-label="Button">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
                    </a>
                    <a onClick={() => this.stopTimer()} class="btn btn-white btn-icon mx-1" aria-label="Button">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
                    </a>
                    <a onClick={() => this.stratTimer()} class="btn btn-white btn-icon mx-1" aria-label="Button">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 4v16l13 -8z" /></svg>
                    </a>
                  </div>
                  <div class="col" style={{ width: '100px' }}>
                    <input type="number" class="form-control" placeholder={t['seconds']} onChange={(e) => this.setState({ timerDuration: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  pollCard() {
    if (this.state.pollCard) {
      return (
        <div class={"col-lg-" + this.state.layoutCol + " p-1 eff-" + this.state.layoutCol} >
          <div class="card mb-1">
            <div class="card-body" style={{ minHeight: '350px' }}>

            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (

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
                  {this.layoutControl()}
                  {this.adminControl()}
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
                  {this.webrtcAlerts()}
                  {this.playList()}
                  <div class="row ">

                    <div id='videoz' class={"col-lg-" + this.state.layoutCol + " p-1 eff-" + this.state.layoutCol} >
                      <div class="card mb-1">
                        <div class="card-body p-1" id='content' style={{ minHeight: '450px' }}>
                          <div id="Dish">

                          </div>
                        </div>
                      </div>
                    </div>
                    <div class={"col-lg-" + this.state.layoutCol + " p-1 eff-" + this.state.layoutCol} >
                      <div class="card mb-1 ">
                        <div class="card-body p-1 " id='content' style={{ minHeight: '450px' }}>
                          <div class="my-auto" id="screen">

                          </div>
                        </div>
                      </div>
                      <div id='mixedaudio' style={{ display: 'block' }}></div>
                    </div>

                    {this.pollCard()}
                    {this.timerCard()}


                  </div>
                  {this.sataPages()}
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>


    )
  }
}




