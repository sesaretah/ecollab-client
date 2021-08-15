import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";


const AttendanceCard = (props) => {
    const t = dict['fa']
    function attendees() {
        var result = []
        if (props.attendees) {
            props.attendees.map((attendee) => {
                result.push(<span class="avatar avatar-sm avatar-rounded" >{attendee.initials}</span>)
            });
        }

        return result
    }

    function createBtn() {
        if (props.is_admin) {
            return (
                <li class="nav-item ms-auto">
                    <a class="nav-link p-1" href={"/#/attendances/create?" + props.attendable_type + "_id=" + props.attendable_id}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 11h6m-3 -3v6" /></svg>
                    </a>
                </li>
            )
        }
    }

    return (

        <div className="card mb-3" style={props.height ? { height: props.height } : { height: 'auto' }}>
            <div className="card-header" >
                <h3 class="card-title">{t['participants']}</h3>
                <ul class="nav nav-pills card-header-pills">
                    {createBtn()}
                </ul>
            </div>
            <div className="card-body card-body-scrollable card-body-scrollable-shadow">

                <div class="avatar-list avatar-list-stacked">
                    {attendees()}
                </div>

            </div>

        </div>

    )
}
export default AttendanceCard;