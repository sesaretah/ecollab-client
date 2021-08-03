import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'jalali-moment'

const MeetingCard = (props) => {
    function formatGregorianDate(gregorianDate) {
        var date = new Date(gregorianDate);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var fullYear = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes;
        return fullYear;
     }
    const t = dict['fa']
    function meetingItems() {
        var result = []
        props.meetings.map((meeting) => {
            result.push(
                <div>
                    <a href={'/#/meetings/' + meeting.id}>
                        <div className="row">
                            <div className="col-auto">
                                <span className="avatar">ح‌ش</span>
                            </div>
                            <div className="col">
                                <div className="text-truncate">
                                    <strong>{meeting.title}</strong>
                                </div>
                                <div className="text-muted">

                                    <p>
                                        {moment(formatGregorianDate(meeting.start_time)).format('HH:mm jYYYY/jMM/jDD')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            )
        })
        return result
    }
    return (
        <div className={props.col ? "col-md-" + props.col : "col-md-8"}>
            <div className="card mb-3" style={props.height ? { height: props.height } : { height: 'auto' }}>
                <div className="card-header" >
                    <h3 class="card-title">{t['meetings']}</h3>
                    <ul class="nav nav-pills card-header-pills">
                        <li class="nav-item ms-auto">
                            <a class="nav-link p-1" href={"/#/meetings/create?event_id=" + props.id}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="card-body card-body-scrollable card-body-scrollable-shadow">
                    <div className="divide-y">
                        {meetingItems()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MeetingCard;
