import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
var t = dict['farsi']

export default class ProfileIndex extends React.Component {

    constructor(props) {
        super(props);
        //this.submit = this.submit.bind(this);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
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
        t = dict[this.state.lang]
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
                    <Header history={this.props.history}/>
                    <div className="page-wrapper">
                        <div className="container-xl">
                            <div className="page-header d-print-none">
                                <div className="row align-items-center"></div>
                                <div className="col">
                                    <div className="page-pretitle">{t['overview']}</div>
                                    <h2 className="page-title">{t['profiles']}</h2>
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




