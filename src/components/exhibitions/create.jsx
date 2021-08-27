import React from 'react'
import ReactDOM from 'react-dom';
import $ from 'jquery';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import { conf } from '../../conf';
import Header from "../header/header.jsx";
import Validation from "../common/validation.jsx";
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
import {
  validateExistence
} from "../common/validate.js";

const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
const t = dict['fa']

export default class ExhibitionCreate extends React.Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteInstance = this.deleteInstance.bind(this);
    this.getList = this.getList.bind(this);

    this.modal = React.createRef();
    this.validateExistence = validateExistence.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      title: null,
      id: null,
      info: null,
      options: [],
      tags: [],
      is_admin: false,
      validationItems: [],
      events: [],
      event_id: null,
    }

  }



  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("deleted_instance", this.deleteInstance);
    ModelStore.on("got_list", this.getList);

  }

  componentWillUnmount() {
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("got_list", this.getList);
    ModelStore.removeListener("deleted_instance", this.deleteInstance);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      MyActions.getInstance('exhibitions', this.props.match.params.id, this.state.token);
    }
    MyActions.getList('events/owner', this.state.page, {}, this.state.token);
  }

  deleteInstance() {
    this.props.history.push("/exhibitions/")
  }


  handleChange(obj) {
    this.setState(obj);
  }

  setInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Exhibition') {
      this.props.history.push("/exhibitions/" + model.id)
    }
  }

  getInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (model && klass === 'Exhibition') {
      this.setState({
        id: model.id,
        title: model.title,
        info: model.info,
        tags: model.tags,
        is_admin: model.is_admin,
        event_id: model.event_id,
        editing: true,
      }, () => {
        //console.log(this.state)
        this.tagSelected(this.state.tags);
        if(!this.state.is_admin){
          this.props.history.push("/exhibitions/")
        }
      })
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

  submit() {
    var data = this.state
    if (this.validateExistence(['title', 'info'])) {
      $('#submit-button').hide();
      $('#submit-spinner').show();
      if (!this.state.editing) {
        MyActions.setInstance('exhibitions', data, this.state.token);
      } else {
        MyActions.updateInstance('exhibitions', data, this.state.token);
      }
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
          id='exhibition-tag'
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

  deleteExhibition() {
    var data = { id: this.state.id }
    MyActions.removeInstance('exhibitions', data, this.state.token);
  }

  deleteBtn() {
    if (this.state.editing) {
      return (
        <button id='delete-button' onClick={() =>{ if (window.confirm(t['are_you_sure'])) this.deleteExhibition()}} class="btn btn-danger ms-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
          {t['delete']}
        </button>
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



  render() {
    const { is_private } = this.state;

    return (
      <body className="antialiased">
        <Validation items={this.state.validationItems} modal={this.modal} />
        <div className="wrapper">
          <Header history={this.props.history} />
          <div className="page-wrapper">
            <div className="container-xl">
              <div className="page-header d-print-none">
                <div className="row align-items-center"></div>
                <div className="col">
                  <div className="page-pretitle">{t['create_exhibition_page']}</div>
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
                        <h3 class="card-title">{t['create_exhibition']}</h3>
                      </div>
                      <div class="card-body">
                        <form>
                          <div class="mb-3">
                            <label class="form-label">{t['exhibition_title']}</label>
                            <input type="text" onInput={(e) => { this.handleChange({ title: e.target.value }) }} id='title' class="form-control" name="text-input" placeholder={t['write_something']} value={this.state.title} />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">{t['exhibition_info']}<span class="form-label-description"></span></label>
                            <textarea onInput={(e) => { this.handleChange({ info: e.target.value }) }} class="form-control" id='content' name="example-textarea-input" rows="6" placeholder={t['write_something']} value={this.state.info}></textarea>
                          </div>

                          <div class="mb-3" style={{ width: '100%' }}>
                            <label class="form-label ">{t['event']}</label>
                            {this.eventOptions()}
                          </div>



                          <div class="mb-3 " id='tags' >
                            <label class="form-label" >{t['tags']}</label>
                            {this.tagShow()}
                          </div>
                        </form>
                      </div>
                      <div class="card-footer">
                        <div class="d-flex">
                          <a href="/#/exhibitions" class="btn btn-link">{t['cancel']}</a>
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




