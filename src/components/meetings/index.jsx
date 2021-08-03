import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import MeetingCard from "./card.jsx";

export default class MeetingIndex extends React.Component {

    constructor(props) {
        super(props);
        //this.submit = this.submit.bind(this);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            title: null,
            meetings: null,
        }

    }



    componentWillMount() {
        ModelStore.on("got_list", this.getList);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
    }

    componentDidMount() {
        MyActions.getList('meetings', this.state.page, {}, this.state.token);
    }

    getList() {
        var meetings = ModelStore.getList()
        var klass = ModelStore.getKlass()
        if (meetings && klass === 'Meeting'){
          this.setState({
            meetings: meetings,
          });
        }
      }


    handleChange(obj) {

    }

    setInstance() {

    }

    noMeetingCard(){
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
                    <a href="/#/meetings/create" class="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="4" x2="21" y2="4" /><path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" /><path d="M8 12l3 -3l2 2l3 -3" /></svg>
                        Create a meeting
                    </a>
                </div>
            </div>
        </div>
    </div>
    }

    checkMeeting() {
        if(this.state.meetings){
            return(<MeetingCard meetings={this.state.meetings} col={12}/>)
        } else {
            return(this.noMeetingCard())
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
                                    <div className="page-pretitle">Overview</div>
                                    <h2 className="page-title">Your meetings</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-deck row-cards">

                                {this.checkMeeting()}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        )
    }
}




