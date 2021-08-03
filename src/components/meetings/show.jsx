import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import $ from 'jquery';
import Header from "../header/header.jsx";
//import Moment from 'react-moment';
//import 'moment-timezone';
import Quill from 'quill';
import AttendanceCard from "../attendances/card.jsx";
import moment from 'jalali-moment'
moment.locale('fa', { useGregorianParser: true });
const t = dict['fa']

export default class MeetingShow extends React.Component {

  constructor(props) {
    super(props);
    this.flyers = this.flyers.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
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
      room_id:  null,
    }

  }



  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("deleted_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("deleted_instance", this.getInstance);
  }

  componentDidMount() {
    MyActions.getInstance('meetings', this.props.match.params.id, this.state.token);
    var quillOne = new Quill('#editor-one', {
      //theme: 'snow',
      readOnly: true,
    });
    this.setState({ quillOne: quillOne })
  }



  handleChange(obj) {

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
      })
    }
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

  flyers() {
    var result = []
    this.state.flyers.map((flyer) => {
      if (flyer.is_default) {
        $('#content').html();
        this.state.quillOne.setContents(flyer.quill_content)
      }
    })
    this.state.flyers.map((flyer) => {
      result.push(
        <div class="list-group-item">
          <div class="row align-items-center">
            <div class="col text-truncate">
              <a style={{ cursor: 'pointer' }} onClick={() => this.loadContent(flyer.quill_content)} class="text-body d-block">{flyer.title}</a>
            </div>
            <div class="col-auto p-0">
              <a href={"/#/flyers/edit/" + flyer.id} class="list-group-item-actions show">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
              </a>
              <a onClick={() => this.deleteFlyer(flyer.id)} class="list-group-item-actions show">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
              </a>

            </div>
            <div class="col-auto p-0">
              <a style={{ cursor: 'pointer', color: '#f4f6fa' }} onClick={() => this.loadContent(flyer.quill_content)} class="text-body d-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="5" y1="12" x2="19" y2="12" /><line x1="5" y1="12" x2="11" y2="18" /><line x1="5" y1="12" x2="11" y2="6" /></svg>
              </a>
            </div>

          </div>
        </div>
      )
    })
    return result
  }


  loadContent(quill_content) {
    $('#content').html();
    this.state.quillOne.setContents(quill_content)
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



  render() {
    const t = dict['fa']
    return (
      <body className="antialiased">
        <div className="wrapper">
          <Header />
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
                      <div className="card-header" >
                        <h3 class="card-title">{this.state.title}</h3>
                        <ul class="nav nav-pills card-header-pills">
                          <li class="nav-item" style={{ marginRight: '10px' }}>
                            {this.isPrivateBadge()}
                          </li>
                          <li class="nav-item ms-auto">
                            <a class="nav-link p-1" href={"/#/meetings/edit/" + this.state.id}>
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
                            </a>
                          </li>
                        </ul>
                      </div>
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
                      <div class="mt-2">
                      <a href={"/#/rooms/"+this.state.room_id} class="btn btn-primary bg-lime w-100">
                        {t['enter_room']}
                      </a>
                    </div>
                      </div>
                    </div>

                    <AttendanceCard attendees={this.state.attendees} attendable_type='meeting' attendable_id={this.state.id} />


                    <div class="card mb-3">
                      <div class="card-header">
                        <h3 class="card-title">{t['pages']}</h3>
                        <ul class="nav nav-pills card-header-pills">
                          <li class="nav-item ms-auto">
                            <a class="nav-link" href={"/#/flyers/create?meeting_id=" + this.state.id}>
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div class="list-group list-group-flush list-group-hoverable">
                        {this.flyers()}
                      </div>
                    </div>

                    <div class="card mb-3">
                      <div class="card-header">
                        <h3 class="card-title">Resources</h3>
                        <ul class="nav nav-pills card-header-pills">
                          <li class="nav-item ms-auto">
                            <a class="nav-link" href="#">
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div class="list-group list-group-flush list-group-hoverable">
                        <div class="list-group-item">
                          <div class="row align-items-center">
                            <div class="col text-truncate">
                              <a href="#" class="text-body d-block"></a>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div class="col-lg-8">
                    <div class="card">
                      <div class="card-body" id='content'>
                        <div id="editor-one"></div>
                      </div>
                    </div>
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




