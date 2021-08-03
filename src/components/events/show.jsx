import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import MeetingCard from "../meetings/card.jsx";
import AttendanceCard from "../attendances/card.jsx";

import $ from 'jquery';
import Quill from 'quill';
const t = dict['fa']

export default class EventShow extends React.Component {

  constructor(props) {
    super(props);
    //this.submit = this.submit.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);

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
        is_private: model.is_private
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
            <div class="col-auto">
              <a href={"/#/flyers/edit/" + flyer.id} class="list-group-item-actions show">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
              </a>
              <a onClick={() => this.deleteFlyer(flyer.id)} class="list-group-item-actions show">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
              </a>
            </div>
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

  render() {

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
                  <h2 className="page-title">{t['event_detail']}</h2>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="container-xl">
                <div className="row  row-cards">

                  <div class="col-lg-4">
                    <div class="card mb-3">
                      <div className="card-header" >
                        <h3 class="card-title">{this.state.title} </h3>
                        <ul class="nav nav-pills card-header-pills">
                          <li class="nav-item" style={{ marginRight: '10px' }}>
                            {this.isPrivateBadge()}
                          </li>
                          <li class="nav-item ms-auto">
                            <a class="nav-link p-1" href={"/#/events/edit/" + this.state.id}>
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div class="card-body">
                        <h4>{t['event_info']}</h4>
                        <div class="text-muted mb-3" style={{ textAlign: 'justify' }}>
                          {this.state.info}
                        </div>

                        <h4>{t['event_type']}</h4>
                        <div class="text-muted mb-3">
                          {t[this.state.event_type]}
                        </div>

                        <h4>{t['tags']}</h4>
                        <div class="text-muted mb-3">
                          {this.tagsShow(this.state.tags)}
                        </div>

                      </div>
                      <div class="card-footer">
                        Lorem ipsum dolor sit amet.
                        <a href="#" target="_blank"> Learn more</a>
                      </div>
                    </div>

                    <AttendanceCard attendees={this.state.attendees} attendable_type='event' attendable_id={this.state.id} />

                    <MeetingCard meetings={this.state.meetings} col='12' id={this.state.id} />

                    <div class="card mb-3">
                      <div class="card-header">
                        <h3 class="card-title">{t['pages']}</h3>
                        <ul class="nav nav-pills card-header-pills">
                          <li class="nav-item ms-auto">
                            <a class="nav-link" href={"/#/flyers/create?event_id=" + this.state.id}>
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div class="list-group list-group-flush list-group-hoverable">
                        {this.flyers()}
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
      </body>
    )
  }
}




