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
