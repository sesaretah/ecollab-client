import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import $ from 'jquery';
import { dict } from '../../Dict';
import { conf } from '../../conf';
import Header from "../header/header.jsx";
import DatePicker from "react-datepicker";
import queryString from 'query-string'
import RangeSlider from 'react-bootstrap-range-slider';
import moment from 'moment-jalaali'
import DatePicker2 from 'react-datepicker2';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
const t = dict['fa']

export default class MeetingCreate extends React.Component {

  constructor(props) {
    super(props);
    this.getInstance = this.getInstance.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      title: null,
      info: null,
      meeting_type: 'online',
      start_time: Date.now(),
      end_time: Date.now(),
      event_id: null,
      capacity: 20,
      editing: false,
      options: [],
      tags: [],
      is_private: false,
    }

  }



  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_instance", this.getInstance);
  }

  componentDidMount() {
    const value = queryString.parse(this.props.location.search);
    this.setState({ event_id: value.event_id }, () => console.log(this.state.event_id))
    if (this.props.match.params.id) {
      MyActions.getInstance('meetings', this.props.match.params.id, this.state.token);
    }
  }


  handleChange(obj) {
    this.setState(obj);
  }

  setInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Meeting') {
      this.props.history.push("/meetings/" + model.id)
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
        editing: true,
      }, () => {
        console.log(this.state)
        this.changeType(this.state.meeting_type)
        this.tagSelected(this.state.tags);
      })
    }
  }

  submit() {
    var data = this.state
    if (!this.state.editing) {
      MyActions.setInstance('meetings', data, this.state.token);
    } else {
      MyActions.updateInstance('meetings', data, this.state.token);
    }
  }

  changeType(e) {
    var self = this;
    $('.form-selectgroup-input').each(function () {
      if ($(this).val() !== e) {
        $(this).prop("checked", false)
      } else {
        if ($(this).checked) {
          $(this).prop("checked", false)
        } else {
          $(this).prop("checked", true)
          self.setState({ meeting_type: e })
        }
      }
    })
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
    if(this.state.is_private){
        this.setState({is_private: false})
    } else {
        this.setState({is_private: true})
    }
  }

  isPrivateBadge(){
    if(this.state.is_private){
      return(
        <span class="badge bg-red-lt">{t['private']}</span>
      )
    }
  }


  render() {
    const { is_private} = this.state; 
    return (
      <body className="antialiased">
        <div className="wrapper">
          <Header history={this.props.history}/>
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

                          <div class="mb-3">
                            <label class="form-label">{t['meeting_type']}</label>
                            <div class="form-selectgroup">
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="in_person" class="form-selectgroup-input" checked="" onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['in_person']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="hybrid" class="form-selectgroup-input" onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['hybrid']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="online" class="form-selectgroup-input" onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['online']}</span>
                              </label>
                              <label class="form-selectgroup-item">
                                <input type="checkbox" name="name" value="online_external" class="form-selectgroup-input" onClick={(e) => this.changeType(e.target.value)} />
                                <span class="form-selectgroup-label">{t['online_external']}</span>
                              </label>
                            </div>
                          </div>

                          <div class="mb-3">
                            <label class="form-label">{t['meeting_capacity']}</label>
                            <RangeSlider
                              value={this.state.capacity}
                              onChange={(e) => { this.handleChange({ capacity: e.target.value }) }}
                            />
                          </div>

                          <div class="mb-3 " id='tags' >
                            <label class="form-label" >{t['tags']}</label>
                            {this.tagShow()}
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
                          <button onClick={() => this.submit()} class="btn btn-primary ms-auto">{t['submit']}</button>
                        </div>
                      </div>
                      <div class="progress progress-sm card-progress">
                        <div class="progress-bar" style={{ width: "100%" }} role="progressbar" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100">
                          <span class="visually-hidden">38% Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-4">
                    <div class="card">
                      <div class="card-status-top bg-lime"></div>
                      <div class="card-body">
                        <h3 class="card-title">Help</h3>
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




