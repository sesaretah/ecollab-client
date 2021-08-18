import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import MeetingCard from "../meetings/card.jsx";
import AttendanceCard from "../attendances/card.jsx";
import { Calendar } from 'react-datepicker2';
import moment from 'moment-jalaali'
import EventCalendar from "../events/calendar.jsx";
import EventInfo from "../events/info.jsx";
import randomColor from "randomcolor";
import $ from 'jquery';
import Quill from 'quill';
const t = dict['fa']

export default class EventShow extends React.Component {

  constructor(props) {
    super(props);
    this.dateSelect = this.dateSelect.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isPrivateBadge = this.isPrivateBadge.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.attend = this.attend.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      title: null,
      id: null,
      event_type: null,
      info: null,
      meetings: [],
      flyers: [],
      quillOne: null,
      attendees: null,
      tags: [],
      is_private: false,
      calendar: false,
      today: moment(),
      highlightRanges: [],
      meetingLoaded: false,
      selectedMeeting: [],
      is_admin: false,
      attending: false,
    }

  }


  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("deleted_instance", this.getInstance);
    ModelStore.on("set_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("deleted_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.getInstance);
  }

  componentDidMount() {
    MyActions.getInstance('events', this.props.match.params.id, this.state.token);
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
    if (klass === 'Event') {
      this.setState({
        title: model.title,
        id: model.id,
        event_type: model.event_type,
        info: model.info,
        meetings: model.meetings,
        flyers: model.flyers,
        attendees: model.attendees,
        tags: model.tags,
        is_private: model.is_private,
        uploads: model.uploads,
        is_admin: model.is_admin,
        attending: model.attending
      }, () => {
        this.constructCalendar();
      })
    }
    console.log(model)
  }



  deleteFlyer(id) {
    var data = { id: id, advertisable_id: this.state.id, advertisable_type: 'Meeting' }
    MyActions.removeInstance('flyers', data, this.state.token);
  }

  loadContent(quill_content) {
    $('#content').html();
    this.state.quillOne.setContents(quill_content)
  }

  toggleCalendar() {
    this.setState({ calendar: !this.state.calendar }, () => {
      if (this.state.calendar) {
        $('#calendar').show();
      } else {
        $('#calendar').hide();
      }
    })


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
        $('#content').html();
        this.state.quillOne.setContents(flyer.quill_content)
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

  isPrivateBadge() {
    if (this.state.is_private) {
      return (
        <span class="badge bg-red-lt">{t['is_private']}</span>
      )
    }
  }

  dateSelect(val) {
    var result = []
    this.state.meetings.map((meeting) => {
      if (Date.parse(meeting.start_day) <= val._d && Date.parse(meeting.end_day) >= val._d) {
        result.push(meeting)
      }
    })
    this.setState({ selectedMeeting: result })
  }

  meetingList() {
    var result = []
    this.state.selectedMeeting.map((s) => {
      result.push(
        <div class="list-group-item">
          <div class="row align-items-center">
            <div class="col text-truncate">
              <a href={"/#/meetings/" + s.id} class="text-body d-block">{s.title}</a>
              <small class="d-block text-muted text-truncate mt-n1">{s.info}</small>
            </div>
            <div class="col-auto">
              {this.tagsShow(s.tags)}
            </div>
          </div>
        </div>
      )
    })
    return result
  }

  constructCalendar() {
    var result = []
    this.state.meetings.map((meeting) => {
      console.log(meeting)
      result.push(
        {
          color: randomColor(),
          start: meeting.start_time,
          end: meeting.end_time
        }
      )
    })
    this.setState({ highlightRanges: this.state.highlightRanges.concat(result), today: null, meetingLoaded: true, })
  }

  showCalendar() {
    if (this.state.meetings && this.state.meetings.length > 0 && this.state.meetingLoaded) {
      return (
        <div class="row row-deck" id='calendar' style={{ display: 'none' }}>
          <div class="col-lg-6">
            <div class="card mb-3" >
              <div class="card-body" >
                <EventCalendar highlightRanges={this.state.highlightRanges} today={this.state.today} dateSelect={this.dateSelect} />
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card mb-3">
              <div class="card-header">
                <h3 class="card-title">{t['meetings']}</h3>
              </div>
              <div class="list-group list-group-flush overflow-auto" style={{ maxHeight: '25rem' }}>
                {this.meetingList()}
              </div>
            </div>
          </div>
        </div>
      )
    }
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
          <a class="nav-link" href={"/#/flyers/create?event_id=" + this.state.id}>
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
          <a class="nav-link" href={"/#/uploads/create?event_id=" + this.state.id}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </a>
        </li>
      )
    }
  }


  attend(flag, attendable_id) {
    var data = { attendable_id: attendable_id, attendable_type: 'Event', flag: flag }
    MyActions.setInstance('attendances/attend', data, this.state.token)
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
                  <h2 className="page-title">{t['event_detail']}</h2>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="container-xl">
                <div className="row  row-cards">

                  <div class="col-lg-4">

                    <EventInfo
                      title={this.state.title} info={this.state.info}
                      isPrivateBadge={this.isPrivateBadge} tagsShow={this.tagsShow}
                      event_type={this.state.event_type} tags={this.state.tags}
                      toggleCalendar={this.toggleCalendar} id={this.state.id}
                      is_admin={this.state.is_admin} attend={this.attend}
                      attending={this.state.attending}
                    />
                    <AttendanceCard attendees={this.state.attendees} attendable_type='event' attendable_id={this.state.id} is_admin={this.state.is_admin} />

                    <MeetingCard meetings={this.state.meetings} col='12' id={this.state.id} is_admin={this.state.is_admin} />

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

                  <div class="col-lg-8">
                    {this.showCalendar()}
                    <div class="card">
                      <div class="card-body" id='content' style={{ margin: 'initial' }}>
                        <div id="editor-one"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    )
  }
}




