import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import $ from 'jquery';
import { dict } from '../../Dict';
import { conf } from '../../conf';
import Header from "../header/header.jsx";
import Validation from "../common/validation.jsx";
import DatePicker from "react-datepicker";
import queryString from 'query-string'
import RangeSlider from 'react-bootstrap-range-slider';
import moment from 'moment-jalaali'
import DatePicker2 from 'react-datepicker2';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
import {
  validateExistence
} from "../common/validate.js";

const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
const t = dict['fa']

export default class MeetingCreate extends React.Component {

  constructor(props) {
    super(props);
    this.getInstance = this.getInstance.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getList = this.getList.bind(this);
    this.deleteInstance = this.deleteInstance.bind(this);
    
    this.modal = React.createRef();
    this.validateExistence = validateExistence.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      title: null,
      info: null,
      meeting_type: 'online',
      start_time: moment(),
      end_time: moment().add(2, 'hour'),
      event_id: null,
      capacity: 20,
      editing: false,
      options: [],
      tags: [],
      is_private: false,
      is_admin: false,
      events: [],
      bigblue: true,
      internal: false,
      sata: false,
      validationItems: [],
    }

  }

  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("got_list", this.getList);
    ModelStore.on("deleted_instance", this.deleteInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("got_list", this.getList);
    ModelStore.removeListener("deleted_instance", this.deleteInstance);
  }

  componentDidMount() {
    const value = queryString.parse(this.props.location.search);
    this.setState({ event_id: value.event_id })
    if (this.props.match.params.id) {
      MyActions.getInstance('meetings', this.props.match.params.id, this.state.token);
    }
    MyActions.getList('events/owner', this.state.page, {}, this.state.token);

  }


  handleChange(obj) {
    this.setState(obj);
  }

  deleteInstance() {
    this.props.history.push("/meetings/")
  }

  setInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Meeting') {
      this.props.history.push("/meetings/" + model.id)
    }
  }

  getList() {
    var list = ModelStore.getList()
    var klass = ModelStore.getKlass()
    if (list && klass === 'Event') {
      this.setState({
        events: list,
      });
    }
  }

  getInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (model && klass === 'Meeting') {
      this.setState({
        id: model.id,
        title: model.title,
        info: model.info,
        meeting_type: model.meeting_type,
        start_time: model.start_time,
        end_time: model.end_time,
        event_id: model.event.id,
        capacity: model.capacity,
        tags: model.tags,
        is_private: model.is_private,
        bigblue: model.bigblue,
        internal: model.internal,
        sata: model.sata,
        is_admin: model.is_admin,
        editing: true,
      }, () => {
        console.log(this.state)
        this.changeType(this.state.meeting_type)
        this.tagSelected(this.state.tags);
        if(!this.state.is_admin){
          this.props.history.push("/meetings/")
        }
      })
    }
  }

  submit() {
    var data = this.state
    if(this.validateExistence(['title', 'info'])){
      $('#submit-button').hide();
      $('#submit-spinner').show();
      if (!this.state.editing) {
        MyActions.setInstance('meetings', data, this.state.token);
      } else {
        MyActions.updateInstance('meetings', data, this.state.token);
      }
    }
  }



  changeType(e) {
    this.setState({ meeting_type: e })
   // this.modal.current.click();
  }

  changeService(e) {
    this.toggleState(e)
  }

  toggleState(s) {
    if (this.state[s]) {
      this.setState({ [`${s}`]: false })
    } else {
      this.setState({ [`${s}`]: true }, () => console.log(this.state))
    }
  }

  tagSelected(tags) {
    var result = []
    tags.map((tag) => {
      if (tag['title']) {
        result.push(tag['title'])
      } else {
        result.push(tag)
      }
    })
    this.setState({ tags: result }, () => console.log(this.state.tags))
  }

  tagShow() {
    if (this.props.match.params.id && this.state.id) {
      return (this.tagInput())
    }

    if (!this.props.match.params.id) {
      return (this.tagInput())
    }
  }

  tagInput() {
    return (
      <div style={{ direction: 'ltr', marginBottom: '70px' }}>
        <AsyncTypeahead
          id='event-tag'
          allowNew
          multiple
          defaultSelected={this.state.tags}
          isLoading={this.state.isLoading}
          labelKey='title'
          onSearch={(query) => {
            this.setState({ isLoading: true });
            fetch(server + "/tags/search?q=" + query)
              .then((resp) => resp.json())
              .then(({ items }) => {
                this.setState({ options: items, isLoading: false }, () => console.log(this.state.options))
              });
          }}
          onChange={(t) => this.tagSelected(t)}
          options={this.state.options}
          renderMenuItemChildren={(option, props) => (
            <React.Fragment>
              <span>{option.title}</span>
            </React.Fragment>
          )}
        />
      </div>
    )
  }

  changeDefault(e) {
    if (this.state.is_private) {
      this.setState({ is_private: false })
    } else {
      this.setState({ is_private: true })
    }
  }

  isPrivateBadge() {
    if (this.state.is_private) {
      return (
        <span class="badge bg-red-lt">{t['private']}</span>
      )
    }
  }

  eventOptions() {
    var result = []
    if (this.state.events) {
      var options = [<option value=''></option>]

      this.state.events.map((event) => {
        options.push(
          <option value={event.id} selected={this.state.event_id == event.id ? true : false}>{event.title}</option>
        )
      })
      result.push(
        <select class="form-select" onChange={(e) => this.handleChange({ event_id: e.target.value })}>
          {options}
        </select>
      )

    }
    return result
  }

  deleteMeeting() {
    var data = { id: this.state.id }
    MyActions.removeInstance('meetings', data, this.state.token);
  }

  deleteBtn() {
    if (this.state.editing) {
      return (
        <button id='delete-button' onClick={() =>{ if (window.confirm(t['are_you_sure'])) this.deleteMeeting()}} class="btn btn-danger ms-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
          {t['delete']}
        </button>
      )
    }
  }


  render() {
    const { is_private } = this.state;
    return (
      <body className="antialiased">
        <Validation items={this.state.validationItems} modal={this.modal}/>
        <div className="wrapper">
          <Header history={this.props.history} />
          <div className="page-wrapper">
            <div className="container-xl">
              <div className="page-header d-print-none">
                <div className="row align-items-center"></div>
                <div className="col">
                  <div className="page-pretitle">{t['create_meeting_page']}</div>
                  <h2 className="page-title">{t['provide_following_info']}</h2>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="container-xl">
                <div className="row row-deck row-cards">
                  <div class="col-md-8">
                    <div class="card">
                      <div class="card-header">
                        <h3 class="card-title">{t['create_meeting']}</h3>
                      </div>
                      <div class="card-body">
                        <form>
                          <div class="mb-3">
                            <label class="form-label">{t['meeting_title']}</label>
                            <input type="text" class="form-control" name="text-input" placeholder={t['write_something']} onInput={(e) => { this.handleChange({ title: e.target.value }) }} value={this.state.title} />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">{t['meeting_info']}<span class="form-label-description"></span></label>
                            <textarea class="form-control" name="example-textarea-input" rows="6" placeholder={t['write_something']} onInput={(e) => { this.handleChange({ info: e.target.value }) }} value={this.state.info}></textarea>
                          </div>

                          <div class="mb-3" style={{ width: '100%' }}>
                            <label class="form-label ">{t['event']}</label>
                            {this.eventOptions()}
                          </div>

                          <div class="mb-3">
                            <label class="form-label">{t['meeting_type']}</label>
                            <div class="form-selectgroup">
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="in_person" class="form-selectgroup-input" checked={this.state.meeting_type === 'in_person' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['in_person']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="hybrid" class="form-selectgroup-input" checked={this.state.meeting_type === 'hybrid' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['hybrid']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="online" class="form-selectgroup-input" checked={this.state.meeting_type === 'online' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['online']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="online_external" class="form-selectgroup-input" checked={this.state.meeting_type === 'online_external' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['online_external']}</span>
                              </label>
                            </div>
                          </div>


                          <div class="mb-3">
                            <label class="form-label">{t['service_type']}</label>
                            <div class="form-selectgroup">
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="internal" class="form-selectgroup-input" checked={this.state.internal ? true : false} onClick={(e) => this.changeService(e.target.value)} />
                                <span class="form-selectgroup-label">{t['internal']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="sata" class="form-selectgroup-input" checked={this.state.sata ? true : false} onClick={(e) => this.changeService(e.target.value)} />
                                <span class="form-selectgroup-label">{t['sata']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="bigblue" class="form-selectgroup-input" checked={this.state.bigblue ? true : false} onClick={(e) => this.changeService(e.target.value)} />
                                <span class="form-selectgroup-label">{t['bigblue']}</span>
                              </label>
                            </div>
                          </div>



                          <div class="mb-3 " id='tags' >
                            <label class="form-label" >{t['tags']}</label>
                            {this.tagShow()}
                          </div>

                          <div class="mb-3">
                            <label class="form-label">{t['meeting_capacity']}</label>
                            <RangeSlider
                              value={this.state.capacity}
                              onChange={(e) => { this.handleChange({ capacity: e.target.value }) }}
                            />
                          </div>


                          <div class="mb-3">
                            <label class="form-label">{t['meeting_start_time']}<span class="form-label-description"></span></label>
                            <DatePicker2
                              isGregorian={false}
                              onChange={value => { this.setState({ start_time: value }) }}
                              value={moment(this.state.start_time)}
                            />
                          </div>

                          <div class="mb-3">
                            <label class="form-label">{t['meeting_end_time']}<span class="form-label-description"></span></label>
                            <DatePicker2
                              isGregorian={false}
                              onChange={value => { this.setState({ end_time: value }) }}
                              value={moment(this.state.end_time)}
                            />
                          </div>


                          <div class="mb-3">
                            <div class="form-label">{t['is_private']}</div>
                            <label class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" onClick={(e) => this.changeDefault(e.target.value)} checked={is_private ? true : false} />
                              <span class="form-check-label">{t['default_is_private_info']}</span>
                            </label>
                          </div>




                        </form>
                      </div>
                      <div class="card-footer">
                        <div class="d-flex">
                          <a href="/#/meetings" class="btn btn-link">{t['cancel']}</a>
                          {this.deleteBtn()}
                          <button id='submit-button' onClick={() => this.submit()} class="btn btn-primary ms-auto">{t['submit']}</button>
                          <div id='submit-spinner' class="spinner-border text-red ms-auto" role="status" style={{ display: 'none' }}></div>
                        </div>
                      </div>
                      <div class="progress progress-sm card-progress">
                        <div class="progress-bar" style={{ width: "100%" }} role="progressbar" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100">
                          <span class="visually-hidden">38% Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <div class="card">
                      <div class="card-status-top bg-lime"></div>
                      <div class="card-body">
                        <h3 class="card-title"></h3>
                        <p></p>
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




