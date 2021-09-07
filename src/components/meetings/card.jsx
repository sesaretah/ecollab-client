import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'jalali-moment'


const MeetingCard = (props) => {
    var t = dict[props.lang]
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

    function editBtn(meeting) {
        if (props.is_admin) {
            return (
                <div class="col-auto">
                    <a href={"/#/meetings/edit/" + meeting.id} class="list-group-item-actions show">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
                    </a>
                </div>
            )
        }
    }

    function meetingLink(meeting) {
        if (meeting.attending) {
            return (
                <a href={'/#/meetings/' + meeting.id}>
                    {meeting.title}
                </a>
            )
        } else {
            return (
                <span>{meeting.title}</span>
            )
        }
    }

    function meetingItems() {
        var result = []
        props.meetings.map((meeting) => {
            result.push(
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col text-truncate">
                            {meetingLink(meeting)}
                            <small class="d-block text-muted text-truncate mt-n1">
                                {moment(formatGregorianDate(meeting.start_time)).format('HH:mm jYYYY/jMM/jDD')}
                            </small>
                        </div>
                        {editBtn(meeting)}
                    </div>
                </div>
            )
        })
        return result
    }

    function createBtn() {
        if (props.is_admin) {
            return (
                <li class="nav-item ms-auto">
                    <a class="nav-link p-1" href={"/#/meetings/create?event_id=" + props.id}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </a>
                </li>
            )
        }
    }

    return (
        <div className={props.col ? "col-md-" + props.col : "col-md-8"}>
            <div className="card mb-3" style={props.height ? { height: props.height } : { height: 'auto' }}>
            <div class="card-status-top bg-purple"></div>
                <div className="card-header" >
                    <h3 class="card-title">{t['meetings']}</h3>
                    <ul class="nav nav-pills card-header-pills">
                        {createBtn()}
                    </ul>
                </div>
                <div class="list-group list-group-flush list-group-hoverable">
                    {meetingItems()}
                </div>
                <div class="card-footer">
                    <div class="d-flex">
                        <a herf="" class="btn btn-link"></a>
                        <a href={'/#/meetings?event_id=' + props.id} class="ms-auto">{t['all']}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MeetingCard;
