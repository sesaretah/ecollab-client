import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { v4 as uuidv4 } from 'uuid';
import moment from 'jalali-moment'
import mm from 'moment'
moment.locale('fa', { useGregorianParser: true });



const MeetingMasonry = (props) => {
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


    function cardCover(meeting) {
        if (meeting.cover) {
            return (
                <a href={'#/meetings/' + meeting.id}>
                    <div class="card-img-top img-responsive img-responsive-16by9" style={{ backgroundImage: "url(" + meeting.cover + ")" }}></div>
                </a>
            )
        }
    }

    function tagsShow(tags) {
        var result = []
        if (tags && tags.length > 0) {
            tags.map((tag) => {
                result.push(<span class="badge bg-lime-lt" style={{ margin: '2px' }}>{tag.title}</span>)
            })
        }
        return result
    }

    function attend(meeting) {
        if (!meeting.is_admin) {
            if (meeting.attending) {
                return (
                    <div className="card-footer" style={{ display: 'initial' }}>
                        <div class="d-flex">
                            <a href={'#/meetings/' + meeting.id} class="btn btn-facebook ms-auto mx-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="2" /><path d="M12 19c-4 0 -7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7c-.42 .736 -.858 1.414 -1.311 2.033" /><path d="M15 19l2 2l4 -4" /></svg>
                                {t['view']}
                            </a>
                            <a onClick={() => props.attend(false, meeting.id)} class="btn btn-outline-secondary ">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mx-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><path d="M10 10l4 4m0 -4l-4 4" /></svg>
                                {t['unregister']}
                            </a>

                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="card-footer" style={{ display: 'initial' }}>
                        <div class="d-flex">
                            <a onClick={() => props.attend(true, meeting.id)} class="btn bg-dark-lt ms-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mx-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2l4 -4" /></svg>
                                {t['register']}
                            </a>
                        </div>
                    </div>
                )
            }
        }
    }

    function meetingLink(meeting) {
        if (meeting.attending) {
            return (
                <a href={'#/meetings/' + meeting.id}>
                    {meeting.title}
                </a>
            )
        } else {
            return (
                <span>{meeting.title}</span>
            )
        }
    }

    function calendarType(date) {
        if (props.lang === 'farsi') {
            return (
                moment(formatGregorianDate(date)).format('HH:mm jYYYY/jMM/jDD')
            )
        } else {
            return (
                mm(date).format('YYYY/MM/DD HH:mm')
            )
        }
    }

    function meetingItems() {
        var result = []
        if (props.meetings) {
            props.meetings.map((meeting) => {
                result.push(

                   
                   
                        <div className="card mb-2">
                            {cardCover(meeting)}

                            <div className="card-body">
                                <h3 class="card-title">
                                    {meetingLink(meeting)}
                                </h3>
                                <p style={{ textAlign: 'justify' }}>
                                    {meeting.truncated_info}
                                </p>

                                <div class='row'>
                                    <div class='col-md-6'>
                                        <h4>{t['meeting_start_time']}:</h4>
                                        <div class="text-muted mb-3">
                                            {calendarType(meeting.start_time)}
                                        </div>
                                    </div>
                                    <div class='col-md-6'>
                                        <h4>{t['meeting_end_time']}:</h4>
                                        <div class="text-muted mb-3">
                                            {calendarType(meeting.end_time)}
                                        </div>
                                    </div>
                                </div>


                                <h4>{t['tags']}</h4>
                                <div class="text-muted">
                                    {tagsShow(meeting.tags)}
                                </div>
                            </div>
                            {attend(meeting)}
                        </div>

                )
            })
        }
        return result
    }

    return (
        <React.Fragment>
            {meetingItems()}
        </React.Fragment>
    )
}
export default MeetingMasonry;
