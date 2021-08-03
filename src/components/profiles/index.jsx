import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";

export default class ProfileIndex extends React.Component {

    constructor(props) {
        super(props);
        //this.submit = this.submit.bind(this);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            profiles: [],
        }

    }



    componentWillMount() {
        ModelStore.on("got_list", this.getList);

    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
    }

    componentDidMount() {
        MyActions.getList('profiles', this.state.page, {}, this.state.token);
    }



    handleChange(obj) {

    }

    getList() {
        var list = ModelStore.getList()
        var klass = ModelStore.getKlass()
        if (list && klass === 'Profile') {
            this.setState({
                profiles: list,
            });
        }
        console.log(list)
    }

    tags(profile) {
        var result = []
        profile.tags.map((tag) => {
            result.push( <span class="badge bg-lime-lt" style={{margin: '2px'}}>{tag.title}</span>)
        })
        return result
    }

    items() {
        var result = []
        this.state.profiles.map((profile) => {
            result.push(
                <div class="col-md-6 col-lg-3">
                    <div class="card">
                        <div class="card-body p-4 text-center">
                            <span class="avatar avatar-xl mb-3 avatar-rounded" >{profile.initials}</span>
                            <h3 class="m-0 mb-1"><a href="#">{profile.name}</a></h3>
                            <div class="text-muted">{profile.short_bio}</div>
                            <div class="mt-3">
                                <div className='example-content'>
                               {this.tags(profile)}
                               </div>
                            </div>
                        </div>
                        <div class="d-flex">
                            <a href="#" class="card-btn">
                           
	<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" /><line x1="12" y1="11" x2="12" y2="11.01" /><line x1="8" y1="11" x2="8" y2="11.01" /><line x1="16" y1="11" x2="16" y2="11.01" /></svg>
                                Message</a>
                            <a href="#" class="card-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path></svg>
                                Call</a>
                        </div>
                    </div>
                </div>
            )
        })
        return result
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
                                    <h2 className="page-title">Profiles</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-deck row-cards">
                                {this.items()}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        )
    }
}




