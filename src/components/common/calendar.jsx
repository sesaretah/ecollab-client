import React from 'react'
import { useHistory } from "react-router-dom";
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import EventCalendar from "../events/calendar.jsx";
import MeetingMasonry from "../meetings/masonry.jsx";
import moment from 'moment-jalaali'
import DatePicker2 from 'react-datepicker2';
import randomColor from "randomcolor";
const t = dict['fa']
export default class MyCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.getInstance = this.getInstance.bind(this);
        this.getList = this.getList.bind(this);
        this.dateSelect = this.dateSelect.bind(this);



        this.state = {
            token: window.localStorage.getItem('token'),
            meetings: [],
            calendar: false,
            today: moment(),
            highlightRanges: [],
            selectedMeeting: [],
        }

    }


    componentWillMount() {
        ModelStore.on("got_instance", this.getInstance);
        ModelStore.on("got_list", this.getList);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
        ModelStore.removeListener("got_instance", this.getInstance);
    }

    componentDidMount() {
        MyActions.getList('meetings/my', this.state.page, {}, this.state.token);

    }

    getInstance() {

    }

    getList() {
        var list = ModelStore.getList()
        var klass = ModelStore.getKlass()
        if (list && klass === 'Meeting') {
            this.setState({ meetings: list }, () => {
                this.constructCalendar();
                this.dateSelect(this.state.today);
            })
        }
    }



    handleChange(obj) {

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

    showCalendar() {
        if (this.state.meetings && this.state.meetings.length > 0 && this.state.meetingLoaded) {
            return (
                <div class="col-lg-4">
                    <div class="card mb-3" >
                        <div class="card-body" >
                            <EventCalendar highlightRanges={this.state.highlightRanges} today={this.state.today} dateSelect={this.dateSelect} />
                        </div>
                    </div>
                </div>
            )
        }
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

    cardMasonry() {
        var result = []
        if (this.state.selectedMeeting) {
            if (this.state.selectedMeeting.length !== 0) {
                result.push(
                    <div class='row row-cards' data-masonry='{"percentPosition": true }' >
                        <MeetingMasonry meetings={this.state.selectedMeeting} col={6} attend={this.attend} />
                    </div>
                )
            }
            if (this.state.selectedMeeting.length === 0) {
                result.push(this.noMeetingCard())
            }
        }

        return result
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



    render() {
        const t = dict['fa']
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
                                        <h2 className="page-title">{t['calendar']}</h2>
                                    </div>
                                    <div class="col-auto ms-auto d-print-none">

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div class="row" id='calendar'>
                                    {this.showCalendar()}
                                    <div class="col-lg-8">
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




