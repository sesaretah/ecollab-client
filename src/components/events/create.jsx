import React from 'react'
import ReactDOM from 'react-dom';
import $ from 'jquery';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import { conf } from '../../conf';
import Header from "../header/header.jsx";
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
const t = dict['fa']

export default class EventCreate extends React.Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      title: null,
      id: null,
      info: null,
      event_type: null,
      is_private: false,
      options: [],
      tags: [],
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
    if (this.props.match.params.id) {
      MyActions.getInstance('events', this.props.match.params.id, this.state.token);
    }
  }



  handleChange(obj) {
    this.setState(obj);
  }

  setInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Event') {
      this.props.history.push("/events/" + model.id)
    }
  }

  getInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (model && klass === 'Event') {
      this.setState({
        id: model.id,
        title: model.title,
        info: model.info,
        event_type: model.event_type,
        tags: model.tags,
        is_private: model.is_private,
        editing: true,
      }, () => {
        console.log(this.state)
        this.changeType(this.state.event_type)
        this.tagSelected(this.state.tags);
      })
    }
  }

  submit() {
    var data = this.state
    if (!this.state.editing) {
      MyActions.setInstance('events', data, this.state.token);
    } else {
      MyActions.updateInstance('events', data, this.state.token);
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
          self.setState({ event_type: e })
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



  render() {
    const { is_private} = this.state;
    
    return (
      <body className="antialiased">
        <div className="wrapper">
          <Header />
          <div className="page-wrapper">
            <div className="container-xl">
              <div className="page-header d-print-none">
                <div className="row align-items-center"></div>
                <div className="col">
                  <div className="page-pretitle">{t['create_event_page']}</div>
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
                        <h3 class="card-title">{t['create_event']}</h3>
                      </div>
                      <div class="card-body">
                        <form>
                          <div class="mb-3">
                            <label class="form-label">{t['event_title']}</label>
                            <input type="text" onInput={(e) => { this.handleChange({ title: e.target.value }) }} id='title' class="form-control" name="text-input" placeholder={t['write_something']} value={this.state.title} />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">{t['event_info']}<span class="form-label-description"></span></label>
                            <textarea onInput={(e) => { this.handleChange({ info: e.target.value }) }} class="form-control" id='content' name="example-textarea-input" rows="6" placeholder={t['write_something']} value={this.state.info}></textarea>
                          </div>

                          <div class="mb-3">
                            <label class="form-label">{t['event_type']}</label>
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
                            </div>
                          </div>

                          <div class="mb-3 " id='tags' >
                            <label class="form-label" >{t['tags']}</label>
                            {this.tagShow()}
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
                          <a href="/#/events" class="btn btn-link">{t['cancel']}</a>
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
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima
                          neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
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




