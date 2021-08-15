import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
const t = dict['fa']

const EventInfo = (props) => {
    function editBtn() {
        if (props.is_admin) {
            return (
                <li class="nav-item ms-auto">
                    <a class="nav-link p-1" href={"/#/events/edit/" + props.id}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
                    </a>
                </li>
            )
        }
    }
    return (
        <div class="card mb-3">
            <div className="card-header bg-dark-lt" >
                <h3 class="card-title">{props.title} </h3>
                <ul class="nav nav-pills card-header-pills">
                    <li class="nav-item" style={{ marginRight: '10px' }}>
                        {props.isPrivateBadge()}
                    </li>
                    {editBtn()}
                </ul>
            </div>
            <a onClick={() => props.toggleCalendar()}>
                <div className="card-header cursor-pointer" >
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="11" y1="15" x2="12" y2="15" /><line x1="12" y1="15" x2="12" y2="18" /></svg>
                    {t['calendar']}
                    <ul class="nav nav-pills card-header-pills">
                        <li class="nav-item ms-auto">

                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="5" y1="12" x2="19" y2="12" /><line x1="5" y1="12" x2="11" y2="18" /><line x1="5" y1="12" x2="11" y2="6" /></svg>
                        </li>
                    </ul>
                </div>
            </a>
            <div class="card-body">
                <h4>{t['event_info']}</h4>
                <div class="text-muted mb-3" style={{ textAlign: 'justify' }}>
                    {props.info}
                </div>

                <h4>{t['event_type']}</h4>
                <div class="text-muted mb-3">
                    {t[props.event_type]}
                </div>

                <h4>{t['tags']}</h4>
                <div class="text-muted mb-3">
                    {props.tagsShow(props.tags)}
                </div>

            </div>
        </div>
    )
}
export default EventInfo;
