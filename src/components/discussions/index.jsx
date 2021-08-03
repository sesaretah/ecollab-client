import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";

export default class DiscssionIndex extends React.Component {

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

                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-deck row-cards">


                                    <div class="card chat-app">
                                        <div id="plist" class="people-list">

                                            <div class="input-icon mb-3">
                                                <input type="text" class="form-control" placeholder="Search…" />
                                                <span class="input-icon-addon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
                                                </span>
                                            </div>
                                            <ul class="list-unstyled chat-list mt-2 mb-0">
                                                <li class="clearfix">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                                    <div class="about">
                                                        <div class="name">Vincent Porter</div>
                                                        <div class="status"> <i class="fa fa-circle offline"></i> left 7 mins ago </div>
                                                    </div>
                                                </li>
                                                <li class="clearfix active">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                                                    <div class="about">
                                                        <div class="name">Aiden Chavez</div>
                                                        <div class="status"> <i class="fa fa-circle online"></i> online </div>
                                                    </div>
                                                </li>
                                                <li class="clearfix">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="avatar" />
                                                    <div class="about">
                                                        <div class="name">Mike Thomas</div>
                                                        <div class="status"> <i class="fa fa-circle online"></i> online </div>
                                                    </div>
                                                </li>
                                                <li class="clearfix">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                    <div class="about">
                                                        <div class="name">Christian Kelly</div>
                                                        <div class="status"> <i class="fa fa-circle offline"></i> left 10 hours ago </div>
                                                    </div>
                                                </li>
                                                <li class="clearfix">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar8.png" alt="avatar" />
                                                    <div class="about">
                                                        <div class="name">Monica Ward</div>
                                                        <div class="status"> <i class="fa fa-circle online"></i> online </div>
                                                    </div>
                                                </li>
                                                <li class="clearfix">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="avatar" />
                                                    <div class="about">
                                                        <div class="name">Dean Henry</div>
                                                        <div class="status"> <i class="fa fa-circle offline"></i> offline since Oct 28 </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="chat">
                                            <div class="chat-header clearfix">
                                                <div class="row">
                                                    <div class="col-lg-6">
                                                        <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                                                        </a>
                                                        <div class="chat-about">
                                                            <h6 class="m-b-0">Aiden Chavez</h6>
                                                            <small>Last seen: 2 hours ago</small>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6 hidden-sm text-right">

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="chat-history">
                                                <ul class="m-b-0">
                                                    <li class="clearfix">
                                                        <div class="message-data text-right">
                                                            <span class="message-data-time">10:10 AM, Today</span>
                                                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                        </div>
                                                        <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                                                    </li>
                                                    <li class="clearfix">
                                                        <div class="message-data">
                                                            <span class="message-data-time">10:12 AM, Today</span>
                                                        </div>
                                                        <div class="message my-message">Are we meeting today?</div>
                                                    </li>
                                                    <li class="clearfix">
                                                        <div class="message-data">
                                                            <span class="message-data-time">10:15 AM, Today</span>
                                                        </div>
                                                        <div class="message my-message">Project has been already finished and I have results to show you.</div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="chat-message clearfix">
                                                <div class="input-group mb-2">
                                                    <input type="text" class="form-control" placeholder="Type here…" />
                                                    <button class="btn" type="button">Send</button>
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




