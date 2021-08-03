import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import EventCard from "./card.jsx";
const t = dict['fa']

export default class EventIndex extends React.Component {

    constructor(props) {
        super(props);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            title: null,
            events: null,
        }

    }


    componentWillMount() {
        ModelStore.on("got_list", this.getList);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
    }

    componentDidMount() {
        MyActions.getList('events', this.state.page, {}, this.state.token);
    }

    getList() {
        var events = ModelStore.getList()
        var klass = ModelStore.getKlass()
        if (events && klass === 'Event') {
            this.setState({
                events: events,
            });
        }
    }



    handleChange(obj) {

    }


    noEventCard() {
        <div class="col-12">
            <div class="card">
                <div class="empty">
                    <div class="empty-img"><img src="./static/illustrations/undraw_quitting_time_dm8t.svg" height="128" alt="" />
                    </div>
                    <p class="empty-title">No results found</p>
                    <p class="empty-subtitle text-muted">
                        Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <div class="empty-action">
                        <a href="/#/events/create" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="10" y1="16" x2="14" y2="16" /><line x1="12" y1="14" x2="12" y2="18" /></svg>
                            Create an event
                        </a>
                    </div>
                </div>
            </div>
        </div>
    }

    checkEvent() {
        if (this.state.events) {
            return (
                <React.Fragment>
                    <div class="col-4">
                        <div class="card">
                            <div class="card-status-top bg-lime"></div>
                            <div className="card-header" >
                                <h3 class="card-title">{t['events']}</h3>
                                <ul class="nav nav-pills card-header-pills">
                                    <li class="nav-item ms-auto">
                                        <a class="nav-link p-1" href={"/#/events/create"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="card-body">
                                <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem
                                </p>
                            </div>
                        </div>
                    </div>
                    <EventCard events={this.state.events} col={8} />
                </React.Fragment>
            )
        } else {
            return (this.noEventCard())
        }
    }


    render() {

        return (
            <body className="antialiased">
                <div className="wrapper">
                    <Header />
                    <div className="page-wrapper">
                        <div className="container-xl">
                            <div className="page-header d-print-none">
                                <div className="row align-items-center"></div>
                                <div className="col">
                                    <div className="page-pretitle">{t['overview']}</div>
                                    <h2 className="page-title">{t['events']}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-deck row-cards">
                                    {this.checkEvent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        )
    }
}




