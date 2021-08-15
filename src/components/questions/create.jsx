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

export default class QuestionCreate extends React.Component {

  constructor(props) {
    super(props);
    this.setInstance = this.setInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      content: null,
      tags: [],
      is_private: false,
      questionable_type: null,
      questionable_id: null,
    }

  }



  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("set_instance", this.setInstance);
  }

  componentDidMount() {
    var self = this;
    const value = queryString.parse(this.props.location.search);
    var questionable_type = '';
    var questionable_id = 0;
    Object.keys(value).map((key) => {
        var splited = key.split("_")
        if (splited[0]) {
            questionable_type = splited[0].charAt(0).toUpperCase() + splited[0].slice(1);
            questionable_id = value[key]
        }
    })
    this.setState({ questionable_type: questionable_type, questionable_id: questionable_id })
  }


  handleChange(obj) {
    this.setState(obj);
  }

  setInstance() {
    var klass = ModelStore.getKlass()
    var model = ModelStore.getIntance()
    if (klass === 'Question') {
        this.props.history.push('/'+model.questionable_link)
    }
  }


  submit() {
    var data = this.state
    if (!this.state.editing) {
      MyActions.setInstance('questions', data, this.state.token);
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
                  <div className="page-pretitle">{t['create_question_page']}</div>
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
                        <h3 class="card-title">{t['create_question']}</h3>
                      </div>
                      <div class="card-body">
                        <form>
                          <div class="mb-3">
                            <label class="form-label">{t['question_content']}<span class="form-label-description"></span></label>
                            <textarea class="form-control" name="example-textarea-input" rows="6" placeholder={t['write_something']} onInput={(e) => { this.handleChange({ content: e.target.value }) }} value={this.state.info}></textarea>
                          </div>


                          <div class="mb-3 " id='tags' >
                            <label class="form-label" >{t['tags']}</label>
                            {this.tagShow()}
                          </div>



                          <div class="mb-3">
                            <div class="form-label">{t['is_private']}</div>
                            <label class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" onClick={(e) => this.changeDefault(e.target.value)} checked={is_private ? true : false} />
                              <span class="form-check-label">{t['default_is_private_question']}</span>
                            </label>
                          </div>




                        </form>
                      </div>
                      <div class="card-footer">
                        <div class="d-flex">
                          <a href="/#/questions" class="btn btn-link">{t['cancel']}</a>
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




