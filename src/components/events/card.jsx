import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { v4 as uuidv4 } from 'uuid';
import moment from 'jalali-moment'
moment.locale('fa', { useGregorianParser: true });

const t = dict['fa']

const EventCard = (props) => {

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


    function cardCover(event) {
        if (event.cover) {
            return (
                <a href={'/#/events/' + event.id}>
                    <div class="card-img-top img-responsive img-responsive-16by9" style={{ backgroundImage: "url(" + event.cover + ")" }}></div>
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


    function attend(event) {
        console.log('event', event)
        if (!event.is_admin) {
            if (event.attending) {
                return (
                    <div className="card-footer" style={{ display: 'initial' }}>
                        <div class="d-flex">
                            <a onClick={() => props.attend(false, event.id)} class="ms-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.823 19.824a2 2 0 0 1 -1.823 1.176h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 1.175 -1.823m3.825 -.177h9a2 2 0 0 1 2 2v9" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="4" /><path d="M4 11h7m4 0h5" /><line x1="11" y1="15" x2="12" y2="15" /><line x1="12" y1="15" x2="12" y2="18" /><line x1="3" y1="3" x2="21" y2="21" /></svg>
                            </a>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="card-footer" style={{ display: 'initial' }}>
                        <div class="d-flex">
                            <a onClick={() => props.attend(true, event.id)} class="ms-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="10" y1="16" x2="14" y2="16" /><line x1="12" y1="14" x2="12" y2="18" /></svg>

                            </a>
                        </div>
                    </div>
                )
            }
        }
    }

    function eventItems() {
        var result = []
        if (props.events) {
            props.events.map((event) => {
                result.push(

                    <div className={props.col ? "col-md-" + props.col : "col-md-8"}>
                        <div className="card">
                            {cardCover(event)}
                            <div className="card-body">
                                <h3 class="card-title">
                                    <a href={'/#/events/' + event.id}>
                                        {event.title}
                                    </a>
                                </h3>
                                <p style={{ textAlign: 'justify' }}>
                                    {event.truncated_info}
                                </p>

                                <h4>{t['event_type']}:</h4>
                                <div class="text-muted mb-3">
                                    {t[event.event_type]}
                                </div>



                                <h4>{t['meeting_start_time']}:</h4>
                                <div class="text-muted mb-3">
                                    {moment(formatGregorianDate(event.start_date)).format('HH:mm jYYYY/jMM/jDD')}
                                </div>

                                <h4>{t['meeting_end_time']}:</h4>
                                <div class="text-muted mb-3">
                                    {moment(formatGregorianDate(event.end_date)).format('HH:mm YYYY/MM/DD')}
                                </div>

                                <h4>{t['tags']}</h4>
                                <div class="text-muted mb-3">
                                    {tagsShow(event.tags)}
                                </div>
                            </div>
                            {attend(event)}
                        </div>
                    </div>
                )
            })
        }
        return result
    }

    return (
        <React.Fragment>
            {eventItems()}
        </React.Fragment>
    )
}
export default EventCard;
