import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import MeetingMasonry from "./masonry.jsx";
import moment from 'moment-jalaali'
import DatePicker2 from 'react-datepicker2';

const t = dict['fa']

export default class MeetingIndex extends React.Component {

    constructor(props) {
        super(props);
        //this.submit = this.submit.bind(this);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            title: null,
            meetings: null,
            allTags: null,
        }

    }



    componentWillMount() {
        ModelStore.on("got_list", this.getList);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
    }

    componentDidMount() {
        MyActions.getList('meetings', this.state.page, {}, this.state.token);
        MyActions.getList('tags/top', this.state.page, {}, this.state.token);
    }

    getList() {
        var list = ModelStore.getList()
        var klass = ModelStore.getKlass()
        if (list && klass === 'Meeting') {
            this.setState({
                meetings: list,
            });
        }
        if (list && klass === 'Tag') {
            this.setState({
                allTags: list,
            });
        }
    }


    handleChange(obj) {

    }

    setInstance() {

    }

    noMeetingCard() {
        <div class="col-12">
            <div class="card">
                <div class="empty">
                    <div class="empty-img"><img src="./static/illustrations/undraw_quitting_time_dm8t.svg" height="128" alt="" />
                    </div>
                    <p class="empty-title">No results found</p>
                    <p class="empty-subtitle text-muted">
                        Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <div class="empty-action">
                        <a href="/#/meetings/create" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="4" x2="21" y2="4" /><path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" /><path d="M8 12l3 -3l2 2l3 -3" /></svg>
                            Create a meeting
                        </a>
                    </div>
                </div>
            </div>
        </div>
    }

    checkMeeting() {
        if (this.state.meetings) {
            return (<MeetingMasonry meetings={this.state.meetings} col={12} />)
        } else {
            return (this.noMeetingCard())
        }
    }

    cardMasonry() {
        if (this.state.meetings) {
            return (
                <div class='row row-cards' data-masonry='{"percentPosition": true }' >
                    <MeetingMasonry meetings={this.state.meetings} col={6} />
                </div>
            )
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
                                    <h2 className="page-title">{t['meetings']}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="card mb-3">
                                            <div className="card-header" >
                                                <h3 class="card-title">{t['meetings']}</h3>
                                                <ul class="nav nav-pills card-header-pills">
                                                    <li class="nav-item ms-auto">
                                                        <a class="nav-link p-1" href={"/#/events/create"}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div class="card-header">
                                                <div class="mb-3" style={{ width: '100%' }}>
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
                                    <div class="col-lg-9">
                                        {this.cardMasonry()}
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




