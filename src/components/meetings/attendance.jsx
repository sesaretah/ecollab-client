import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";

export default class MeetingAttendance extends React.Component {

    constructor(props) {
        super(props);
        //this.submit = this.submit.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            title: null,
        }

    }



    componentWillMount() {
        ModelStore.on("set_instance", this.setInstance);

    }

    componentWillUnmount() {
        ModelStore.removeListener("set_instance", this.setInstance);
    }

    componentDidMount() {

    }



    handleChange(obj) {

    }

    setInstance() {

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
                                    <div className="page-pretitle">Overview</div>
                                    <h2 className="page-title">Condensed dark layout</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-deck row-cards">

                                    <div className="col-md-6">
                                        <div class="card mb-3">
                                            <div class="card-header">
                                                <h3 class="card-title">Add Attendees</h3>
                                            </div>
                                            <div class="list-group list-group-flush list-group-hoverable">
                                                <div class="list-group-item">
                                                    <div class="input-icon mb-3">
                                                        <input type="text" class="form-control" placeholder="Search…" />
                                                        <span class="input-icon-addon">

                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="list-group-item">
                                                    <div class="row align-items-center">
                                                        <div class="col-auto"><span class="badge bg-red"></span></div>
                                                        <div class="col-auto">
                                                            <a href="#">
                                                                <span class="avatar" ></span>
                                                            </a>
                                                        </div>
                                                        <div class="col text-truncate">
                                                            <a href="#" class="text-body d-block">Paweł Kuna</a>
                                                            <small class="d-block text-muted text-truncate mt-n1">Change deprecated html tags to text decoration classes (#29604)</small>
                                                        </div>
                                                        <div class="col-auto">
                                                            <a href="#" class="list-group-item-actions">
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        )
    }
}




