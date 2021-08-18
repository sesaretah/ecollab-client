import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { v4 as uuidv4 } from 'uuid';
import moment from 'jalali-moment'
moment.locale('fa', { useGregorianParser: true });

const t = dict['fa']

const MeetingMasonry = (props) => {

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
                <a href={'/#/meetings/' + meeting.id}>
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
                            <a onClick={() => props.attend(false, meeting.id)} class="ms-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.823 19.824a2 2 0 0 1 -1.823 1.176h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 1.175 -1.823m3.825 -.177h9a2 2 0 0 1 2 2v9" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="4" /><path d="M4 11h7m4 0h5" /><line x1="11" y1="15" x2="12" y2="15" /><line x1="12" y1="15" x2="12" y2="18" /><line x1="3" y1="3" x2="21" y2="21" /></svg>
                            </a>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="card-footer" style={{ display: 'initial' }}>
                        <div class="d-flex">
                            <a onClick={() => props.attend(true, meeting.id)} class="ms-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="10" y1="16" x2="14" y2="16" /><line x1="12" y1="14" x2="12" y2="18" /></svg>

                            </a>
                        </div>
                    </div>
                )
            }
        }
    }

    function meetingItems() {
        var result = []
        if (props.meetings) {
            props.meetings.map((meeting) => {
                result.push(

                    <div className={props.col ? "col-md-" + props.col : "col-md-8"}>
                        <div className="card">
                            {cardCover(meeting)}

                            <div className="card-body">
                                <h3 class="card-title">
                                    <a href={'/#/meetings/' + meeting.id}>
                                        {meeting.title}
                                    </a>
                                </h3>
                                <p style={{ textAlign: 'justify' }}>
                                    {meeting.truncated_info}
                                </p>

                                <h4>{t['meeting_type']}:</h4>
                                <div class="text-muted mb-3">
                                    {t[meeting.meeting_type]}
                                </div>



                                <h4>{t['meeting_start_time']}:</h4>
                                <div class="text-muted mb-3">
                                    {moment(formatGregorianDate(meeting.start_time)).format('HH:mm jYYYY/jMM/jDD')}
                                </div>

                                <h4>{t['meeting_end_time']}:</h4>
                                <div class="text-muted mb-3">
                                    {moment(formatGregorianDate(meeting.end_time)).format('HH:mm YYYY/MM/DD')}
                                </div>

                                <h4>{t['tags']}</h4>
                                <div class="text-muted mb-3">
                                    {tagsShow(meeting.tags)}
                                </div>
                            </div>
                            {attend(meeting)}
                        </div>
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
