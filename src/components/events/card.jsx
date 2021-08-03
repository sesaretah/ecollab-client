import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";


const EventCard = (props) => {
    function eventItems() {
        var result = []
        if(props.events){
        props.events.map((event) => {
            result.push(
                <div>
                <a href={'/#/events/'+event.id}>
                    <div className="row">
                        <div className="col-auto">
                            <span className="avatar">JL</span>
                        </div>
                        <div className="col">
                            <div className="text-truncate">
                                <strong>{event.title}</strong>
                            </div>
                            <div className="text-muted text-truncate">
                            {event.info}
                            </div>
                        </div>
                        <div className="col-auto align-self-center">
                            <div className="badge bg-primary"></div>
                        </div>
                    </div>
                </a>
                </div>
            )
        })
    }
        return result
    }

    return (
        <div className={props.col ? "col-md-"+props.col : "col-md-8"}>
            <div className="card" style={{height: '24rem'}}>
                <div className="card-body card-body-scrollable card-body-scrollable-shadow">
                    <div className="divide-y">
                        {eventItems()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EventCard;
