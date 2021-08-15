import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import { Calendar } from 'react-datepicker2';
import moment from 'moment-jalaali'
import randomColor from "randomcolor";
import DatePicker2 from 'react-datepicker2';
import MeetingInfo from "../meetings/info.jsx";
import $ from 'jquery';
const t = dict['fa']

export default class EventDetail extends React.Component {

  constructor(props) {
    super(props);
    this.getInstance = this.getInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isPrivateBadge = this.isPrivateBadge.bind(this);
    this.getList = this.getList.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      title: null,
      id: null,
      event_type: null,
      info: null,
      meetings: [],
      tags: [],
      is_private: false,
      allTags: [],
      start_time: moment(),
      end_time: moment(),
      selectedTags: []
    }

  }


  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("deleted_instance", this.getInstance);
    ModelStore.on("got_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("deleted_instance", this.getInstance);
    ModelStore.removeListener("got_list", this.getList);
  }

  componentDidMount() {
    MyActions.getInstance('events', this.props.match.params.id, this.state.token);
    MyActions.getList('events/tags', this.state.page, { id: this.props.match.params.id });
    //MyActions.getList('events/meetings', this.state.page, { id: this.props.match.params.id });
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
        tags: model.tags,
        is_private: model.is_private
      }, () => {
        //this.constructCalendar();
      })
    }
    console.log(model)
  }

  getList() {
    var list = ModelStore.getList()
    var klass = ModelStore.getKlass()
    if (list && klass === 'Tag') {
      this.setState({
        allTags: list,
      });
    }
    if (list && klass === 'Meeting') {
      this.setState({
        meetings: list,
      });
    }
    console.log(list)
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

  changeTags(e) {
    var self = this;
    var el = '#tag-check-' + e.target.value
    console.log($(el), $(el).is(':checked'))
    if (!$(el).is(':checked')) {
      // $('#tag-check-'+e.target.value).prop("checked", false)
      var array = [...self.state.selectedTags]; // make a separate copy of the array
      var index = array.indexOf(e.target.value)
      if (index !== -1) {
        array.splice(index, 1);
        self.setState({ selectedTags: array })
      }

    } else {
      //  $('#tag-check-'+e.target.value).prop("checked", true)
      self.setState({ selectedTags: self.state.selectedTags.concat(e.target.value) }, () => {
        console.log(self.state.selectedTags)
      })
    }
  }

  tagCheckbox() {
    var result = []
    if (this.state.allTags) {
      this.state.allTags.map((tag) => {
        result.push(
          <label class="form-check">
            <input id={'tag-check-' + tag.id} class="form-check-input" type="checkbox" style={{ marginTop: '3.5px' }} value={tag.id} onChange={(e) => this.changeTags(e)} />
            <span class="form-check-label">
              <span class="badge bg-lime-lt" style={{ margin: '2px' }}>{tag.title}</span>
            </span>
          </label>
        )
      })
    }
    return result
  }

  checkTags() {

  }


  meetingList() {
    var result = []
    this.state.meetings.map((meeting) => {
      // console.log(meeting.info)
      result.push(

        <MeetingInfo
          title={meeting.title} info={meeting.info} start_time={meeting.start_time}
          end_time={meeting.end_time} isPrivateBadge={this.isPrivateBadge} tagsShow={this.tagsShow}
          meeting_type={meeting.meeting_type} tags={meeting.tags}
          id={meeting.id} event={meeting.event} page='detail'
          attendees={meeting.attendees}
        />
      )
    })
    return result
  }

  filterSearch() {
    MyActions.getList('events/meetings', this.state.page, { tag_ids: this.state.selectedTags, start_time: this.state.start_time, end_time: this.state.end_time, id: this.props.match.params.id }, this.state.token);
  }





  render() {

    return (
      <body className="antialiased">
        <div className="wrapper">
          <Header history={this.props.history}/>
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

                  <div class="col-lg-3">
                    <div class="card mb-3">
                      <div class="card-header">
                        <h3 class="card-title">
                          <a href={"/#/events/" + this.state.id}>
                            {this.state.title}
                          </a>
                        </h3>

                      </div>
                      <div class="card-header">
                        <div class="mb-3" style={{width: '100%'}}>
                          <label class="form-label ">{t['meeting_start_time']}<span class="form-label-description"></span></label>
                          <DatePicker2
                            isGregorian={false}
                            onChange={value => { this.setState({ start_time: value }) }}
                            value={moment(this.state.start_time)}
                          />
                          <label class="form-label mt-2">{t['meeting_end_time']}<span class="form-label-description"></span></label>
                          <DatePicker2
                            isGregorian={false}
                            onChange={value => { this.setState({ end_time: value }) }}
                            value={moment(this.state.end_time)}
                          />
                        </div>
                      </div>
                      <div class="card-header">
                        <div class="mb-3">
                          <div class="subheader mb-2">
                            {t['tags']}
                          </div>
                          <div>
                            {this.tagCheckbox()}
                          </div>
                        </div>
                      </div>
                      <div class="card-body">

                        <a onClick={() => this.filterSearch()} class="btn btn-primary w-100">
                          <span style={{ verticalAlign: '-2px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" /></svg>
                          </span>
                          {t['filter']}
                        </a>
                      </div>

                    </div>
                  </div>

                  <div class="col-lg-9 col-xs-9">
                    {this.meetingList()}
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




