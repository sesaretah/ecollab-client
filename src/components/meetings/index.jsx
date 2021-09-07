import React from 'react';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import $ from 'jquery';
import { dict } from '../../Dict';
import { conf } from '../../conf';
import queryString from 'query-string'
import Header from "../header/header.jsx";
import MeetingMasonry from "./masonry.jsx";
import moment from 'moment-jalaali';
import mm from 'moment';
import DatePicker2 from 'react-datepicker2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
var t = dict['farsi']

export default class MeetingIndex extends React.Component {

    constructor(props) {
        super(props);
        this.setInstance = this.setInstance.bind(this);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.attend = this.attend.bind(this);
        this.getInstance = this.getInstance.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            title: null,
            meetings: null,
            events: null,
            q: '',
            start_from: mm(),
            start_to: mm().add(2, 'Month'),
            tags: [],
            page: 1,
            event_id: 0,
            pages: 0,
            registration_status: 'all',
            searched: false,
            event_name: '',

            isGregorian: true,
            userAbilities: null,
        }

    }



    componentWillMount() {
        ModelStore.on("got_list", this.getList);
        ModelStore.on("set_instance", this.setInstance);
        ModelStore.on("got_instance", this.getInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
        ModelStore.removeListener("set_instance", this.setInstance);
        ModelStore.removeListener("got_instance", this.getInstance);
    }

    componentDidMount() {
        t = dict[this.state.lang]
        if (this.state.lang === 'farsi') {
            this.setState({
                start_from: moment(),
                start_to: moment().add(2, 'jMonth'),
                isGregorian: false,
            })
        }
        var location = window.location.href.split('#')[0].split('/')
        var event_name = location[3]
        if (event_name !== '') {
            this.setState({ event_name: event_name })
        }
        const value = queryString.parse(this.props.location.search);
        if (value.event_id) {
            this.setState({ event_id: value.event_id })
            var data = { registration_status: this.state.registration_status, event_id: value.event_id, event_name: event_name, start_from: this.state.start_from, start_to: this.state.start_to }
            this.setState({ page: 1, searched: true }, () => {
                MyActions.getList('meetings/search', this.state.page, data, this.state.token);
            })
        } else {
            var data = { registration_status: this.state.registration_status, start_from: this.state.start_from, event_name: event_name, start_to: this.state.start_to }
            this.setState({ page: 1, searched: true }, () => {
                MyActions.getList('meetings/search', this.state.page, data, this.state.token);
            })
        }
        if (value.registration_status) {
            this.setState({ registration_status: value.registration_status })
        }
        if (this.state.token && this.state.token.length > 10) {
            MyActions.getInstance('profiles/my', 1, this.state.token);
        } else {
            this.props.history.push("login")
        }

        MyActions.getList('events/related', this.state.page, {}, this.state.token);
    }

    getList() {
        var list = ModelStore.getList()
        var klass = ModelStore.getKlass()

        if (list && klass === 'Meeting') {
            $('#search-spinner').hide();
            if (list[0] && list[0].page) {
                if (list[0].page == 1) {
                    this.setState({
                        meetings: list,
                    });
                } else {
                    this.setState({
                        meetings: this.state.meetings.concat(list),
                    });
                }
                this.setState({ page: list[0].page, pages: list[0].pages })
            } else {
                this.setState({
                    meetings: [],
                    pages: 0,
                });
            }
            console.log(list)
        }
        if (list && klass === 'Event') {
            this.setState({
                events: list,
            });
        }
    }



    handleChange(obj) {
        this.setState(obj);
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (model && klass === 'Meeting') {
            var self = this;
            var meetings = self.state.meetings;
            if (meetings.length > 0) {
                for (let i = 0; i < meetings.length; i++) {
                    if (meetings[i].id == model.id) {
                        let newState = Object.assign({}, self.state);
                        newState.meetings[i] = model;
                        self.setState(newState, () => console.log(self.state.meetings));
                    }
                }
            }
        }
    }

    getInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()

        if (model && klass === 'Profile') {
            this.setState({
                profile: model,
                userAbilities: model.abilities
            });
        }
    }

    noMeetingCard() {
        return (
            <div class="card">
                <div class="empty">
                    <div class="empty-img">
                        <div className="demo-icon-preview"><svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 9v2m0 4v.01"></path><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path></svg></div>
                    </div>
                    <p class="empty-title">{t['no_result_to_show']}</p>
                    <p class="empty-subtitle text-muted">
                        {t['try_adjusting_your_search']}
                    </p>
                </div>
            </div>
        )
    }

    checkMeeting() {
        if (this.state.meetings) {
            return (<MeetingMasonry meetings={this.state.meetings} col={12} />)
        } else {
            return (this.noMeetingCard())
        }
    }

    cardMasonry() {
        var result = []
        if (this.state.meetings) {
            if (this.state.meetings.length !== 0) {
                result.push(
                    <div class='card-columns'  >
                        <MeetingMasonry meetings={this.state.meetings} col={6} attend={this.attend} lang={this.state.lang} />
                    </div>
                )
            }
            if (this.state.meetings.length === 0) {
                result.push(this.noMeetingCard())
            }
        }

        return result
    }

    search() {
        $('#search-spinner').show();
        var data = { q: this.state.q, registration_status: this.state.registration_status, event_id: this.state.event_id, event_name: this.state.event_name, start_from: this.state.start_from, start_to: this.state.start_to, tags: this.state.tags }
        this.setState({ page: 1, searched: true }, () => {
            MyActions.getList('meetings/search', this.state.page, data, this.state.token);
        })
    }

    attend(flag, attendable_id) {
        var data = { attendable_id: attendable_id, attendable_type: 'Meeting', flag: flag }
        MyActions.setInstance('attendances/attend', data, this.state.token)
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

    tagInput() {
        return (
            <div style={{ direction: 'ltr', marginBottom: '70px' }}>
                <AsyncTypeahead
                    id='search-tag'
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


    loadMore() {
        if (this.state.searched) {
            var data = { page: this.state.page + 1, q: this.state.q, event_id: this.state.event_id, event_name: this.state.event_name, start_from: this.state.start_from, start_to: this.state.start_to, tags: this.state.tags }
            MyActions.getList('meetings/search', this.state.page + 1, data, this.state.token);
        } else {
            var data = { page: this.state.page + 1 }
            MyActions.getList('meetings', this.state.page + 1, data, this.state.token);
        }

    }

    eventOptions() {
        var result = []
        if (this.state.events) {
            var options = [<option value=''></option>]

            this.state.events.map((event) => {
                if (event.id == this.state.event_id) {
                    options.push(
                        <option value={event.id} selected={true}>{event.title}</option>
                    )
                } else {
                    options.push(
                        <option value={event.id}>{event.title}</option>
                    )
                }

            })
            result.push(
                <select class="form-select" onChange={(e) => this.handleChange({ event_id: e.target.value })}>
                    {options}
                </select>
            )

        }
        return result
    }

    moreBtn() {
        if (this.state.pages > this.state.page) {
            return (
                <div class="hr-text">
                    <a onClick={() => this.loadMore()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><line x1="8" y1="12" x2="12" y2="16" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="16" y1="12" x2="12" y2="16" /></svg>
                        {t['more']}
                    </a>
                </div>
            )
        }
    }

    changeType(e) {
        this.setState({ registration_status: e })
    }

    calendarType() {
        if (this.state.lang === 'farsi') {
            return (
                <React.Fragment>
                    <label class="form-label ">{t['date_from']}<span class="form-label-description"></span></label>
                    <DatePicker2
                        isGregorian={this.state.isGregorian}
                        onChange={value => { this.setState({ start_from: value }) }}
                        value={this.state.start_from}
                    />
                    <label class="form-label mt-2">{t['date_to']}<span class="form-label-description"></span></label>
                    <DatePicker2
                        isGregorian={this.state.isGregorian}
                        onChange={value => { this.setState({ start_to: value }) }}
                        value={this.state.start_to}
                    />
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <label class="form-label ">{t['date_from']}<span class="form-label-description"></span></label>
                    <DatePicker
                        onChange={value => { this.setState({ start_from: value }) }}
                        showTimeSelect
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="yyyy/MM/dd HH:mm"
                        selected={mm(this.state.start_from).toDate()}
                        className='datepicker-input'
                    />
                    <label class="form-label mt-2">{t['date_to']}<span class="form-label-description"></span></label>
                    <DatePicker
                        onChange={value => { this.setState({ start_to: value }) }}
                        showTimeSelect
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="yyyy/MM/dd HH:mm"
                        selected={mm(this.state.start_to).toDate()}
                        className='datepicker-input'
                    />
                </React.Fragment>
            )
        }
    }

    createBtn() {
        if (this.state.userAbilities && this.state.userAbilities.create_event) {
            return (
                <div class="btn-list">
                    <a href={"/#/meeting/create"} class="btn btn-primary"  >
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        {t['create_meeting']}
                    </a>
                </div>
            )
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
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="page-pretitle">{t['overview']}</div>
                                        <h2 className="page-title">{t['meetings']}</h2>
                                    </div>
                                    <div class="col-auto ms-auto d-print-none">
                                        {this.createBtn()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="card mb-3">
                                            <div className="card-header" >
                                                <h4 class="card-title">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" /></svg>
                                                    {t['filter_meetings']}
                                                </h4>
                                            </div>

                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">{t['contains_words']}</label>
                                                    <div class="input-icon mb-3">
                                                        <input type="text" class="form-control" placeholder={t['search_placeholder']} onInput={(e) => { this.handleChange({ q: e.target.value }) }} />
                                                        <span class="input-icon-addon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="mb-3" style={{ width: '100%' }}>
                                                    <label class="form-label ">{t['event']}</label>
                                                    {this.eventOptions()}
                                                </div>
                                                <div class="mb-3" style={{ width: '100%' }}>

                                                    {this.calendarType()}
                                                </div>

                                                <div class="mb-3">
                                                    <div class="form-label">{t['registeration']}</div>
                                                    <div>
                                                        <label class="form-check ">
                                                            <input class="form-check-input" type="radio" value='all' checked={this.state.registration_status === 'all' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                            <span class="form-check-label">{t['all']}</span>
                                                        </label>
                                                        <label class="form-check ">
                                                            <input class="form-check-input" type="radio" value='registered' checked={this.state.registration_status === 'registered' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                            <span class="form-check-label">{t['registered']}</span>
                                                        </label>
                                                        <label class="form-check ">
                                                            <input class="form-check-input" type="radio" value='not_registered' checked={this.state.registration_status === 'not_registered' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                            <span class="form-check-label">{t['not_registered']}</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div class="mb-3 " id='tags' >
                                                    <label class="form-label" >{t['tags']}</label>
                                                    {this.tagInput()}
                                                </div>
                                            </div>
                                            <div class="card-body">

                                                <a onClick={() => this.search()} class="btn btn-primary w-100">
                                                    <span style={{ verticalAlign: '-2px' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" /></svg>
                                                    </span>
                                                    {t['filter_and_search']}
                                                    <div id='search-spinner' class="spinner-border text-red" role="status" style={{ display: 'none' }}></div>
                                                </a>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="col-lg-9">
                                        {this.cardMasonry()}
                                        {this.moreBtn()}
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




