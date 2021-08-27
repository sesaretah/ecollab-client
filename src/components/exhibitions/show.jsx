import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import MeetingCard from "../meetings/card.jsx";
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';
import AttendanceCard from "../attendances/card.jsx";
import QuestionCard from "../questions/card.jsx";
import Quill from 'quill';
import { socket } from '../../socket.js'
import FlyerCard from "../flyers/card.jsx";
import {
  appendChat, chatItems, throttle, send, wsSend, keydownHandler, scrollChat
} from "../rooms/chat.js";

const t = dict['fa']

export default class ExhibitionShow extends React.Component {

  constructor(props) {
    super(props);
    this.getInstance = this.getInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.socketHandle = this.socketHandle.bind(this);
    
    this.appendChat = appendChat.bind(this);
    this.chatItems = chatItems.bind(this);
    this.throttle = throttle.bind(this);
    this.send = send.bind(this);
    this.wsSend = wsSend.bind(this);
    this.keydownHandler = keydownHandler.bind(this);
    this.scrollChat = scrollChat.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      title: null,
      id: null,
      info: null,
      flyers: [],
      questions: [],
      quillOne: null,
      tags: [],
      uploads: null,
      is_admin: false,
      attendees: [],
      room_id: null,
      roomId: null,
      cover: null,

      name: null,
      fullname: null,
      initials: null,
      userUUID: null,

      chats: [],
      lastTime: Date.now(),
      content: null,
      item: null,
      quill_content: null,
    }

  }


  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("deleted_instance", this.getInstance);
    document.addEventListener('keydown', this.keydownHandler);
  }

  componentWillUnmount() {
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("deleted_instance", this.getInstance);
    document.removeEventListener('keydown', this.keydownHandler);
  }

  componentDidMount() {
    var self = this;
    MyActions.getInstance('exhibitions', this.props.match.params.id, this.state.token);
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
  }

  socketHandle(msg) {
    var self = this;
    var parsed = msg;
    switch (parsed.type) {
      case "chat":
        self.appendChat(parsed.c);
        break;
      case "userCounter":
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
    if (klass === 'Exhibition') {
      this.setState({
        title: model.title,
        id: model.id,
        info: model.info,
        flyers: model.flyers,
        tags: model.tags,
        uploads: model.uploads,
        is_admin: model.is_admin,
        attendees: model.attendees,
        room_id: model.room_id,
        roomId: model.room_uuid,
        cover: model.cover,
        questions: model.questions
      }, () => {
        if (this.state.token && this.state.token.length > 10) {
          MyActions.setInstance('users/validate_token', {}, this.state.token);
        }
        if (this.state.flyers && this.state.flyers[0]) {
          this.loadContent(this.state.flyers[0].quill_content)
        }
      })
    }
    console.log(model)
  }

  setInstance() {
    var self = this;
    var klass = ModelStore.getKlass()
    var user = ModelStore.getIntance();
    if (klass === 'Validate') {
      this.setState({ name: user.name, fullname: user.name, initials: user.initials, userUUID: user.uuid }, () => {
        this.connectSocketRoom();
        //console.log(self.state)
      });
    }
  }


  deleteFlyer(id) {
    var data = { id: id, advertisable_id: this.state.id, advertisable_type: 'Meeting' }
    MyActions.removeInstance('flyers', data, this.state.token);
  }

  loadContent(quill_content) {
    this.setState({ quill_content: quill_content })
  }

  editFlyerBtn(flyer) {
    if (this.state.is_admin) {
      return (
        <div class="col-auto">
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
      if (flyer.is_default) {
        // $('#content').html();
        // this.state.quillOne.setContents(flyer.quill_content)
      }
    })
    this.state.flyers.map((flyer) => {
      result.push(
        <div class="list-group-item">
          <div class="row align-items-center">
            <div class="col text-truncate">
              <a onClick={() => this.loadContent(flyer.quill_content)} class="text-body d-block">{flyer.title}</a>
            </div>
            {this.editFlyerBtn(flyer)}
          </div>
        </div>
      )
    })
    return result
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

  editUploadBtn(upload) {
    if (this.state.is_admin) {
      return (
        <div class="col-auto p-0">
          <a onClick={() => this.deleteFlyer(upload.id)} class="list-group-item-actions show">
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
                  <a style={{ cursor: 'pointer' }} href={upload.link} class="text-body d-block">{upload.title}</a>
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
          <a class="nav-link" href={"/#/flyers/create?exhibition_id=" + this.state.id}>
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
          <a class="nav-link" href={"/#/uploads/create?exhibition_id=" + this.state.id}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </a>
        </li>
      )
    }
  }

  editExhibitionBtn() {
    if (this.state.is_admin) {
      return (
        <li class="nav-item ms-auto">
          <a class="nav-link p-1" href={"/#/exhibitions/edit/" + this.state.id}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
          </a>
        </li>
      )
    }
  }

  addAttendance() {
    if (this.state.is_admin) {
      return (
        <AttendanceCard is_admin={this.state.is_admin} attendees={this.state.attendees} attendable_type='exhibition' attendable_id={this.state.id} />
      )
    }

  }

  connectSocketRoom() {
    if (this.state.userUUID && this.state.roomId) {
      socket.emit('room', { room: this.state.roomId, uuid: this.state.userUUID });
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
                  <h2 className="page-title">{t['exhibition_detail']}</h2>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="container-xl">
                <div className="row  row-cards">

                  <div class="col-lg-4">
                    <div class="card mb-3">
                      <div className="card-header bg-dark-lt" >
                        <h3 class="card-title">{this.state.title} </h3>
                        <ul class="nav nav-pills card-header-pills">
                          {this.editExhibitionBtn()}
                        </ul>
                      </div>
                      <ul class="nav nav-tabs" data-bs-toggle="tabs">
                        <li class="nav-item">
                          <a href="#tabs-home-9" class="nav-link active" data-bs-toggle="tab">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" /><polyline points="11 12 12 12 12 16 13 16" /></svg>
                            {t['details']}
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="#tabs-profile-9" onClick={() => this.scrollChat()} class="nav-link" data-bs-toggle="tab">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" /><path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" /></svg>
                            {t['chats']}
                          </a>
                        </li>
                      </ul>

                      <div class="tab-content">
                        <div class="tab-pane active show" id='tabs-home-9'>

                          <div class="card-body">
                            <h4>{t['exhibition_info']}</h4>
                            <div class="text-muted mb-3" style={{ textAlign: 'justify' }}>
                              {this.state.info}
                            </div>


                            <h4>{t['tags']}</h4>
                            <div class="text-muted mb-3">
                              {this.tagsShow(this.state.tags)}
                            </div>
                          </div>
                          <div class="card-footer">
                            <div class="mt-2">
                              <a href={"/#/rooms/" + this.state.room_id + "?rnd=" + uuidv4()} class="btn btn-primary bg-green-lt w-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><line x1="15" y1="8" x2="17" y2="8" /><line x1="15" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="17" y2="16" /></svg>
                                {t['enter_room_with_admin']}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div class="tab-pane" id='tabs-profile-9' >
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
                      </div>
                    </div>

                    {this.addAttendance()}

                    <QuestionCard is_admin={this.state.is_admin} questions={this.state.questions} questionable_type='exhibition' questionable_id={this.state.id} />

                    <div class="card mb-3">
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

                  </div>

                  <FlyerCard quill_content={this.state.quill_content} cover={this.state.cover} />

                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    )
  }
}




