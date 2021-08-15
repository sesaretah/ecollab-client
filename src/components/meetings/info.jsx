import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { v4 as uuidv4 } from 'uuid';
import moment from 'jalali-moment'
moment.locale('fa', { useGregorianParser: true });

const t = dict['fa']


const MeetingInfo = (props) => {
    function isEvent() {
        if (props.event) {
            return (
                <React.Fragment>
                    <h4>{t['related_to_event']}:</h4>
                    <div class="text-muted mb-3">
                        <a href={'/#/events/' + props.event.id}>{props.event.title}</a>
                    </div>
                </React.Fragment>
            )
        }
    }

    function footerBar() {
        if (props.page && props.page == 'meeting') {
            return (
                <div class="card-footer">
                    <div class="mt-2">
                        <a href={"/#/rooms/" + props.room_id + "?rnd=" + uuidv4()} onClick={props.forceUpdate} class="btn btn-primary bg-lime w-100">
                            {t['enter_room']}
                        </a>
                    </div>
                </div>
            )
        }
        if (props.page && props.page == 'detail') {
            return (
                <div class="card-footer">
                    <div class="row align-items-center">
                        <div class="col-auto ">
                            <div class="avatar-list avatar-list-stacked">
                                {avatar()}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    function avatar() {
        var result = []
        if (props.attendees) {
            props.attendees.map((att) => {
                result.push(<span class="avatar avatar-sm avatar-rounded" >{att.initials}</span>)
            })
        }
        return result
    }

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

    function sideBlock(item, title) {
        if (props[item]) {
            return (
                <React.Fragment>
                    <h4>{title}:</h4>
                    <div class="text-muted mb-3">
                        {props[item]}
                    </div>
                </React.Fragment>
            )
        }
    }
    return (
        <div class="card mb-3">
            <div className="card-header" >
                <h3 class="card-title">{props.title}</h3>
                <ul class="nav nav-pills card-header-pills">
                    <li class="nav-item" style={{ marginRight: '10px' }}>
                        {props.isPrivateBadge()}
                    </li>
                    <li class="nav-item ms-auto">
                        <a class="nav-link p-1" href={"/#/meetings/edit/" + props.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="card-body">
                {isEvent()}
                {sideBlock('info', t['meeting_info'])}
                <React.Fragment>
                    <h4>{t['meeting_type']}:</h4>
                    <div class="text-muted mb-3">
                        {t[props.meeting_type]}
                    </div>
                </React.Fragment>
                {sideBlock('capacity', t['meeting_capacity'])}
                {sideBlock('external_link', t['meeting_external_link'])}

                <h4>{t['meeting_start_time']}:</h4>
                <div class="text-muted mb-3">
                    {moment(formatGregorianDate(props.start_time)).format('HH:mm jYYYY/jMM/jDD')}
                </div>

                <h4>{t['meeting_end_time']}:</h4>
                <div class="text-muted mb-3">
                    {moment(formatGregorianDate(props.end_time)).format('HH:mm YYYY/MM/DD')}
                </div>

                <h4>{t['tags']}</h4>
                <div class="text-muted mb-3">
                    {props.tagsShow(props.tags)}
                </div>


            </div>

            {footerBar()}

        </div>
    )
}
export default MeetingInfo;
