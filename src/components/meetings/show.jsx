import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import $ from 'jquery';
import Header from "../header/header.jsx";
import { v4 as uuidv4 } from 'uuid';
import Quill from 'quill';
import AttendanceCard from "../attendances/card.jsx";
import moment from 'jalali-moment'
import { socket } from '../../socket.js'
import FlyerCard from "../flyers/card.jsx";
import PollCard from "../polls/create.jsx";

import {
  isFirefox, isMobile
} from "react-device-detect";
import {
  appendChat, chatItems, throttle, send, wsSend, keydownHandler, scrollChat
} from "../rooms/chat.js";

moment.locale('fa', { useGregorianParser: true });
var t = dict['farsi']

export default class MeetingShow extends React.Component {

  constructor(props) {
    super(props);
    this.flyers = this.flyers.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.postPolling = this.postPolling.bind(this);

    this.socketHandle = this.socketHandle.bind(this);
    this.appendChat = appendChat.bind(this);
    this.chatItems = chatItems.bind(this);
    this.throttle = throttle.bind(this);
    this.send = send.bind(this);
    this.wsSend = wsSend.bind(this);
    this.keydownHandler = keydownHandler.bind(this);
    this.scrollChat = scrollChat.bind(this);
    this.getList = this.getList.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      lang: window.localStorage.getItem('lang'),
      dir: window.localStorage.getItem('dir'),
      title: null,
      start_time: null,
      end_time: null,
      info: null,
      capacity: null,
      meeting_type: null,
      event: { title: '', id: 0 },
      flyers: [],
      quillOne: null,
      attendees: null,
      tags: [],
      is_private: false,
      room_id: null,
      roomId: null,
      cover: null,
      is_admin: false,
      room: null,

      name: null,
      fullname: null,
      initials: null,
      userUUID: null,

      userCounter: 0,

      fullAlert: false,
      timelyAlert: false,

      attending: false,

      chats: [],
      lastTime: Date.now(),
      content: null,
      item: null,
      quill_content: null,

      polls: null,
      star: null,

      is_presenter: false,
      is_moderator: false,
      is_speaker: false,

      activeTab: 'details',
      attendeesCount: 0,
    }

  }



  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("deleted_instance", this.getInstance);
    ModelStore.on("got_list", this.getList);
    document.addEventListener('keydown', this.keydownHandler);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_list", this.getList);
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("deleted_instance", this.getInstance);
    document.removeEventListener('keydown', this.keydownHandler);
    //socket.disconnect();
    if(this.state.roomId && this.state.userUUID ) {
      socket.emit('leaveRoomView', { room: this.state.roomId.toString(), uuid: this.state.userUUID });
    }
    
  }

  componentDidMount() {
    t = dict[this.state.lang]
    var self = this;
    MyActions.getInstance('meetings', this.props.match.params.id, this.state.token);
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
    MyActions.getList('polls', this.state.page, { pollable_type: 'Meeting', pollable_id: this.props.match.params.id }, this.state.token);
  }

  getList() {
    var list = ModelStore.getList()
    var klass = ModelStore.getKlass()

    if (list && klass === 'Poll') {
      this.setState({
        polls: list,
      });
    }
    console.log(list)
  }


  socketHandle(msg) {
    var self = this;
    var parsed = msg;
    switch (parsed.type) {
      case "chat":
        self.appendChat(parsed.c);
        break;
      case "userCounter":
        console.log(parsed.c)
        self.setState({ userCounter: parsed.c });
        break;
    }
  }



  handleChange(obj) {
    this.setState(obj);
  }

  getInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Meeting') {
      this.setState({
        title: model.title,
        id: model.id,
        start_time: model.start_time,
        end_time: model.end_time,
        info: model.info,
        capacity: model.capacity,
        meeting_type: model.meeting_type,
        event: model.event,
        flyers: model.flyers,
        attendees: model.attendees,
        tags: model.tags,
        is_private: model.is_private,
        room_id: model.room_id,
        roomId: model.room_uuid,
        cover: model.cover,
        uploads: model.uploads,
        is_admin: model.is_admin,
        is_presenter: model.is_presenter,
        is_moderator: model.is_moderator,
        is_speaker: model.is_speaker,
        bigblue: model.bigblue,
        internal: model.internal,
        sata: model.sata,
        attending: model.attending,
        attendeesCount: model.attendees_count
      }, () => {
        if (!this.state.attending) {
          window.location.replace('/#/meetings')
        }
        if (this.state.token && this.state.token.length > 10) {
          MyActions.setInstance('users/validate_token', {}, this.state.token);
        }
        if (this.state.flyers) {
          this.state.flyers.map((flyer) => {
            if (flyer.is_default) {
              this.loadContent(flyer.quill_content)
            }
          })

        }
      })
    }
    if (klass === 'MeetingUrl') {

      if (model.url) {
        console.log(model)
        $('#bigblue-spinner').hide();
        if (model.full && !this.state.is_admin) {
          this.setState({ fullAlert: true })
        }
        if (!model.timely && !this.state.is_admin) {
          this.setState({ timelyAlert: true })
        }
        if (this.state.is_admin) {
          if (isFirefox || isMobile){
            window.location.replace(model.url)
          } else {
            window.open(model.url, '_blank')
          }
        }
        if (!model.full && !this.state.is_admin && model.timely) {
          if (isFirefox || isMobile){
            window.location.replace(model.url)
          } else {
            window.open(model.url, '_blank')
          }
        }

      }
    }
  }

  setInstance() {
    var self = this;
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance();
    if (klass === 'Validate') {
      console.log('validated')
      this.setState({ name: model.name, fullname: model.name, initials: model.initials, userUUID: model.uuid }, () => {
        this.connectSocketRoom();

      });
    }
    if (klass === 'Polling') {
      this.setState({ polls: model.polls })
    }
    console.log(model)
  }

  sideBlock(item, title) {
    if (this.state[item]) {
      return (
        <React.Fragment>
          <h4>{title}:</h4>
          <div class="text-muted mb-3">
            {this.state[item]}
          </div>
        </React.Fragment>
      )
    }
  }

  deleteFlyer(id) {
    var data = { id: id, advertisable_id: this.state.id, advertisable_type: 'Meeting' }
    MyActions.removeInstance('flyers', data, this.state.token);
  }

  editFlyerBtn(flyer) {
    if (this.state.is_admin) {
      return (
        <div class="col-auto p-0">
          <a href={"/#/flyers/edit/" + flyer.id} class="list-group-item-actions show">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
          </a>
          <a onClick={() => this.deleteFlyer(flyer.id)} class="list-group-item-actions show">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
          </a>
        </div>
      )
    }
  }

  flyers() {
    var result = []
    this.state.flyers.map((flyer) => {
      result.push(
        <div class="list-group-item">
          <div class="row align-items-center">
            <div class="col text-truncate">
              <a style={{ cursor: 'pointer' }} onClick={() => this.loadContent(flyer.quill_content)} class="text-body d-block">{flyer.title}</a>
            </div>
            {this.editFlyerBtn(flyer)}
          </div>
        </div>
      )
    })
    return result
  }


  loadContent(quill_content) {
    this.setState({ quill_content: quill_content })
  }

  formatGregorianDate(gregorianDate) {
    var date = new Date(gregorianDate);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var fullYear = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes;
    return fullYear;
  }


  tagsShow(tags) {
    var result = []
    if (tags && tags.length > 0) {
      tags.map((tag) => {
        result.push(<span class="badge bg-lime-lt" style={{ margin: '2px' }}>{tag.title}</span>)
      })
    }
    return result
  }

  isPrivateBadge() {
    if (this.state.is_private) {
      return (
        <span class="badge bg-red-lt">{t['is_private']}</span>
      )
    }
  }

  cardCover() {
    if (this.state.cover) {
      return (<div class="card-img-top img-responsive img-responsive-16by9" style={{ backgroundImage: "url(" + this.state.cover + ")" }}></div>)
    }
  }

  deleteUpload(id) {
    var data = { id: id }
    MyActions.removeInstance('uploads', data, this.state.token);
  }

  editUploadBtn(upload) {
    if (this.state.is_admin) {
      return (
        <div class="col-auto p-0">
          <a onClick={() => this.deleteUpload(upload.id)} class="list-group-item-actions show">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
          </a>
        </div>
      )
    }
  }

  uploads() {
    var result = []
    if (this.state.uploads) {
      this.state.uploads.map((upload) => {
        if (upload.upload_type !== 'cover') {
          result.push(
            <div class="list-group-item">
              <div class="row align-items-center">
                <div class="col text-truncate">
                  <a style={{ cursor: 'pointer' }} href={upload.link} target='_blank' class="text-body d-block">{upload.title}</a>
                </div>
                {this.editUploadBtn(upload)}
              </div>
            </div>
          )
        }
      })
    }
    return result
  }

  createFlyerBtn() {
    if (this.state.is_admin) {
      return (
        <li class="nav-item ms-auto">
          <a class="nav-link" href={"/#/flyers/create?meeting_id=" + this.state.id}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </a>
        </li>
      )
    }
  }

  createUploadBtn() {
    if (this.state.is_admin) {
      return (
        <li class="nav-item ms-auto">
          <a class="nav-link" href={"/#/uploads/create?meeting_id=" + this.state.id}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </a>
        </li>
      )
    }
  }

  editMeetingBtn() {
    if (this.state.is_admin) {
      return (
        <li class="nav-item ms-auto">
          <a class="nav-link p-1" href={"/#/meetings/edit/" + this.state.id}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
          </a>
        </li>
      )
    }
  }

  connectSocketRoom() {
    if (this.state.userUUID && this.state.roomId) {
      socket.emit('room', { room: this.state.roomId.toString(), uuid: this.state.userUUID });
      socket.emit('setRoomView', { room: this.state.roomId.toString(), uuid: this.state.userUUID });
    }
  }

  createBigBlue() {
    $('#bigblue-spinner').show();
    MyActions.getInstance('meetings/join_bigblue', this.props.match.params.id, this.state.token);
  }

  roomBtn() {
    var result = []
    if ((this.state.internal || this.state.sata) && (this.state.is_speaker || this.state.is_moderator || this.state.is_presenter)) {
      result.push(
        <a href={"/#/rooms/" + this.state.room_id + "?rnd=" + uuidv4()} onClick={this.forceUpdate} class="btn bg-green-lt">
          {t['enter_room']}
        </a>
      )
    }
    if (this.state.bigblue) {
      result.push(
        <a onClick={() => this.createBigBlue()} class="btn bg-cyan-lt ms-auto">
          {t['enter_bigblue_room']}
          <div id='bigblue-spinner' class="spinner-border text-black" role="status" style={{ display: 'none' }}></div>
        </a>
      )
    }
    return result
  }


  fullAlert() {
    if (this.state.fullAlert) {
      return (
        <div class="alert alert-important alert-danger alert-dismissible" role="alert">
          <div class="d-flex">
            <div>
            </div>
            <div>
              {t['room_is_full']}
            </div>
          </div>
          <a class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="close"></a>
        </div>
      )
    }
  }


  timelyAlert() {
    if (this.state.timelyAlert) {
      return (
        <div class="alert alert-important alert-danger alert-dismissible" role="alert">
          <div class="d-flex">
            <div>
            </div>
            <div>
              {t['out_of_time']}
            </div>
          </div>
          <a class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="close"></a>
        </div>
      )
    }
  }


  postPolling(id, value) {
    var data = { poll_id: id, outcome: value }
    MyActions.setInstance('pollings', data, this.state.token);
  }

  polls() {
    var result = []
    if (this.state.polls) {
      this.state.polls.map((poll) => {
        result.push(<PollCard postPolling={this.postPolling} star={this.state.star} handleChange={this.handleChange} poll={poll} />)
      })
    }
    return result
  }

  pollSettings() {
    if (this.state.is_admin) {
      return (
        <div style={{ backgroundColor: '#f4f6fa', minHeight: '25px', marginTop: '0px' }}>
          <div className="col-auto">
            <a href={'/#/polls?meeting_id=' + this.state.id}>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" style={{ float: 'left', marginTop: '3px', marginLeft: '5px' }} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><circle cx="12" cy="12" r="3" /></svg>
            </a>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <body className="antialiased">
        <div className="wrapper">
          <Header history={this.props.history} />
          <div className="page-wrapper">
            <div className="container-xl">
              <div className="page-header d-print-none">
                <div className="row align-items-center"></div>
                <div className="col">
                  <div className="page-pretitle">{t['overview']}</div>
                  <h2 className="page-title">{t['meeting_detail']}</h2>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="container-xl">
                <div className="row  row-cards">

                  <div class="col-lg-4">
                    <div class="card mb-3">
                      <div class="card-status-top bg-indigo"></div>
                      <div className="card-header bg-dark-lt" >
                        <h3 class="card-title">{this.state.title}</h3>
                        <ul class="nav nav-pills card-header-pills">
                          <li class="nav-item mx-2">
                            {this.isPrivateBadge()}
                          </li>
                          {this.editMeetingBtn()}
                        </ul>
                      </div>
                      <ul class="nav nav-tabs" data-bs-toggle="tabs">
                        <li class="nav-item">
                          <a onClick={() => this.setState({activeTab: 'details'})}  className={this.state.activeTab == "details" ? "nav-link active" : "nav-link"} data-bs-toggle="tab">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" /><polyline points="11 12 12 12 12 16 13 16" /></svg>
                            {t['details']}
                          </a>
                        </li>
                        <li class="nav-item">
                          <a onClick={() => {this.scrollChat(); this.setState({activeTab: 'chats'})}} className={this.state.activeTab == "chats" ? "nav-link active" : "nav-link"} data-bs-toggle="tab">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" /><path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" /></svg>
                            {t['chats']}
                          </a>
                        </li>
                        <li class="nav-item">
                          <div onClick={() => this.setState({activeTab: 'polls'})}  className={this.state.activeTab == "polls" ? "nav-link active" : "nav-link"}  data-bs-toggle="tab ">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" /><line x1="12" y1="12" x2="20" y2="7.5" /><line x1="12" y1="12" x2="12" y2="21" /><line x1="12" y1="12" x2="4" y2="7.5" /></svg>
                            {t['polls']}
                          </div>
                        </li>
                        <span  class="badge bg-teal ms-auto mt-2 mx-2">
                          {t['viewers']} {this.state.userCounter}
                        </span>
                      </ul>


                      <div class="tab-content">
                        <div className={this.state.activeTab == "details" ? "tab-pane active show" : "tab-pane"}>
                          <div class="card-body">
                            <h4>{t['related_to_event']}:</h4>
                            <div class="text-muted mb-3">
                              <a href={'/#/events/' + this.state.event.id}>{this.state.event.title}</a>
                            </div>

                            {this.sideBlock('info', t['meeting_info'])}
                            <React.Fragment>
                              <h4>{t['meeting_type']}:</h4>
                              <div class="text-muted mb-3">
                                {t[this.state.meeting_type]}
                              </div>
                            </React.Fragment>
                            {this.sideBlock('capacity', t['meeting_capacity'])}
                            {this.sideBlock('external_link', t['meeting_external_link'])}

                            <h4>{t['meeting_start_time']}:</h4>
                            <div class="text-muted mb-3">
                              {moment(this.formatGregorianDate(this.state.start_time)).format('HH:mm jYYYY/jMM/jDD')}
                            </div>

                            <h4>{t['meeting_end_time']}:</h4>
                            <div class="text-muted mb-3">
                              {moment(this.formatGregorianDate(this.state.end_time)).format('HH:mm YYYY/MM/DD')}
                            </div>

                            <h4>{t['tags']}</h4>
                            <div class="text-muted mb-3">
                              {this.tagsShow(this.state.tags)}
                            </div>

                          </div>
                          <div class="card-footer">
                            <div class="d-flex">
                              {this.roomBtn()}
                            </div>
                          </div>
                        </div>
                        {this.fullAlert()}
                        {this.timelyAlert()}

                        <div className={this.state.activeTab == "chats" ? "tab-pane active show" : "tab-pane"} id='tabs-profile-9' >
                          <div class="card mb-3 maxh-250 minh-250" style={{ borderColor: 'white', boxShadow: 'none' }}>
                            <div class="list-group list-group-flush overflow-auto" id='chat-box' style={{ maxHeight: '25rem' }}>
                              {this.chatItems()}
                            </div>
                            <div class="card-footer" style={{ borderColor: 'white' }} >
                              <div class="row">
                                <div class="col">
                                  <input id='chat-form' type="text" class="form-control" placeholder={t['write_something']} onChange={(e) => {
                                    this.handleChange({ item: { content: e.target.value, name: this.state.name, initials: this.state.initials, time: Date.now(), uuid: uuidv4() } })
                                  }} />
                                </div>
                                <div class="col-auto">
                                  <a onClick={() => this.send()} class="btn btn-white btn-icon" aria-label="Button">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /></svg>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={this.state.activeTab == "polls" ? "tab-pane active show" : "tab-pane"} id='tabs-vote' >
                          <div class="card mb-3" style={{ borderColor: 'white', boxShadow: 'none' }}>
                            <div className='card-body p-0' style={{ maxHeight: '250px', overflowY: 'scroll' }}>
                                  {this.pollSettings()}
                              <div className='p-2'>
                                {this.polls()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="card mb-3">
                      <div class="card-status-top bg-azure"></div>
                      <div class="card-header">
                        <h3 class="card-title">{t['pages']}</h3>
                        <ul class="nav nav-pills card-header-pills">
                          {this.createFlyerBtn()}
                        </ul>
                      </div>
                      <div class="list-group list-group-flush list-group-hoverable">
                        {this.flyers()}
                      </div>
                    </div>

                    <div class="card mb-3">
                      <div class="card-status-top bg-muted"></div>
                      <div class="card-header">
                        <h3 class="card-title">{t['resources']}</h3>
                        <ul class="nav nav-pills card-header-pills">
                          {this.createUploadBtn()}
                        </ul>

                      </div>
                      <div class="list-group list-group-flush list-group-hoverable">
                        {this.uploads()}
                      </div>
                    </div>

                    <AttendanceCard is_admin={this.state.is_admin} attendees={this.state.attendees} attendeesCount={this.state.attendeesCount} attendable_type='meeting' attendable_id={this.state.id} lang={this.state.lang} />


                  </div>

                  <FlyerCard quill_content={this.state.quill_content} cover={this.state.cover} />

                </div>
              </div>
            </div>
          </div>
        </div >
      </body >
    )
  }
}




