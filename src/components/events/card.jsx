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
                            <a href={'/#/events/' + event.id} class="btn btn-facebook ms-auto mx-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="2" /><path d="M12 19c-4 0 -7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7c-.42 .736 -.858 1.414 -1.311 2.033" /><path d="M15 19l2 2l4 -4" /></svg>
                                {t['view']}
                            </a>
                            <a onClick={() => props.attend(false, event.id)} class="btn btn-outline-secondary">
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
                            <a onClick={() => props.attend(true, event.id)} class="btn bg-dark-lt ms-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mx-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2l4 -4" /></svg>
                                {t['register']}
                            </a>
                        </div>
                    </div>
                )
            }
        }
    }


    function eventLink(event) {
        if (event.attending) {
            return (
                <a href={'/#/events/' + event.id}>
                    {event.title}
                </a>
            )
        } else {
            return (
                <span>{event.title}</span>
            )
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
                                    {eventLink(event)}
                                </h3>
                                <p style={{ textAlign: 'justify' }}>
                                    {event.truncated_info}
                                </p>

                                <h4>{t['event_type']}:</h4>
                                <div class="text-muted mb-3">
                                    {t[event.event_type]}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <h4>{t['meeting_start_time']}:</h4>
                                        <div class="text-muted mb-3">
                                            {moment(formatGregorianDate(event.start_date)).format('HH:mm jYYYY/jMM/jDD')}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h4>{t['meeting_end_time']}:</h4>
                                        <div class="text-muted mb-3">
                                            {moment(formatGregorianDate(event.end_date)).format('HH:mm YYYY/MM/DD')}
                                        </div>
                                    </div>
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
