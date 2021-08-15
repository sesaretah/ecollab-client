import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import EventCard from "../events/card.jsx";
import ProfileCard from "../profiles/card.jsx";
import ProgressCard from "../attendances/card.jsx";

export default class Dashboard extends React.Component {

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
              <Header history={this.props.history}/>
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
                      <EventCard />
                      <ProfileCard />
                      <ProgressCard />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        )
    }
}




