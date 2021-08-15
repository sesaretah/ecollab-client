import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import queryString from 'query-string'
const t = dict['fa']
export default class AttendanceCreate extends React.Component {

    constructor(props) {
        super(props);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.getMultipleList = this.getMultipleList.bind(this);
        this.search = this.search.bind(this);


        this.state = {
            token: window.localStorage.getItem('token'),
            title: null,
            attendances: null,
            users: null,
            attendable_type: '',
            attendable_id: 0,
            q: '',
            selectedUser: null,
        }

    }
    componentWillMount() {
        ModelStore.on("got_multiple_list", this.getMultipleList);
        ModelStore.on("set_instance", this.setInstance);
        ModelStore.on("deleted_instance", this.getInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_multiple_list", this.getMultipleList);
        ModelStore.removeListener("set_instance", this.setInstance);
        ModelStore.removeListener("deleted_instance", this.getInstance);
    }

    componentDidMount() {
        const value = queryString.parse(this.props.location.search);
        var attendable_type = '';
        var attendable_id = 0;
        Object.keys(value).map((key) => {
            var splited = key.split("_")
            if (splited[0]) {
                attendable_type = splited[0].charAt(0).toUpperCase() + splited[0].slice(1);
                attendable_id = value[key]
            }
        })
        this.setState({ attendable_type: attendable_type, attendable_id: attendable_id }, () => {
            MyActions.getMultipleList('attendances', this.state.page, this.state, this.state.token);
        })

    }


    getMultipleList() {
        var multiple = ModelStore.getMutipleList()
        var klass = ModelStore.getKlass()
        console.log(multiple)
        if (multiple && klass === 'Attendance') {
            this.setState({
                users: multiple.users,
                attendances: multiple.attendances,
            });
        }
    }


    getInstance() {
        MyActions.getMultipleList('attendances', this.state.page, this.state, this.state.token);
    }



    handleChange(obj) {
        this.setState(obj);
    }

    search(q) {
        if (q.length > 3) {
            this.setState({ q: q }, () =>
                MyActions.getMultipleList('attendances', this.state.page, this.state, this.state.token)
            );
        } else {
            this.setState({ q: '' }, () =>
                MyActions.getMultipleList('attendances', this.state.page, this.state, this.state.token)
            );
        }
    }

    setInstance() {
        MyActions.getMultipleList('attendances', this.state.page, this.state, this.state.token);
    }

    addParticipant(user_id) {
        if (this.state.attendable_type !== '') {
            var data = { attendable_id: this.state.attendable_id, attendable_type: this.state.attendable_type, user_id: user_id }
            MyActions.setInstance('attendances', data, this.state.token);
        }
    }

    removeParticipant(id) {
        var data = { id: id, attendable_id: this.state.attendable_id, attendable_type: this.state.attendable_type }
        MyActions.removeInstance('attendances', data, this.state.token);
    }

    userItems(users) {
        var result = []
        if (users) {
            users.map((user) => {
                result.push(
                    <div class="list-group-item" style={{ border: 'none' }}>
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <a onClick={() => this.addParticipant(user.user_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </a>
                            </div>
                            <div class="col-auto">
                                <a href="#">
                                    <span class="avatar" >{user.initials}</span>
                                </a>
                            </div>
                            <div class="col text-truncate">
                                <a href="#" class="text-body d-block">{user.name}</a>
                                <small class="d-block text-muted text-truncate mt-n1">{user.bio}</small>
                            </div>
                            <div class="col-auto">
                            </div>

                        </div>
                    </div>
                )
            })
        }
        return result
    }

    changeDuty(id, value) {
        console.log(id, value)
        MyActions.setInstance('attendances/change_duty', { id: id, duty: value }, this.state.token);
        //MyActions.updateInstance('')
    }

    dutyOptions(attendance) {
        if (this.props.duties) {
            var options = []
            this.props.duties.map((duty) => {
                options.push(
                    <option value={duty} selected={attendance.duty === duty ? true : false}>{t[duty]}</option>
                )
                return (
                    <select class="form-select" onChange={(e) => this.changeDuty(attendance.id, e.target.value)}>
                        {options}
                    </select>
                )
            })

        } else {
            return (
                <select class="form-select" onChange={(e) => this.changeDuty(attendance.id, e.target.value)}>
                    <option value='moderator' selected={attendance.duty === 'moderator' ? true : false}>{t['moderator']}</option>
                    <option value='presenter' selected={attendance.duty === 'presenter' ? true : false}>{t['presenter']}</option>
                    <option value='speaker' selected={attendance.duty === 'speaker' ? true : false}>{t['speaker']}</option>
                    <option value='listener' selected={attendance.duty === 'listener' ? true : false}>{t['listener']}</option>
                </select>
            )
        }
    }

    attendanceItems(attendances) {
        var result = []
        if (attendances) {
            attendances.map((attendance) => {
                console.log(attendance)
                var user = attendance.profile
                result.push(
                    <div class="list-group-item" style={{ border: 'none' }}>
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <a onClick={() => this.removeParticipant(attendance.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </a>
                            </div>
                            <div class="col-auto">
                                <a href="#">
                                    <span class="avatar" >{user.initials}</span>
                                </a>
                            </div>
                            <div class="col text-truncate">
                                <a href="#" class="text-body d-block">{user.name}</a>
                                <small class="d-block text-muted text-truncate mt-n1">{user.bio}</small>
                            </div>
                            <div class="col-auto" >
                                {this.dutyOptions(attendance)}
                            </div>

                        </div>
                    </div>
                )
            })
        }
        return result
    }


    render() {

        return (
            <body className="antialiased">
                <div className="wrapper">
                    <Header history={this.props.history} />
                    <div className="page-wrapper">
                        <div className="container-xl">
                            <div className="page-header d-print-none">
                                <div className="row align-items-center"></div>
                                <div className="col">
                                    <div className="page-pretitle">{t['add_participants']}</div>
                                    <h2 className="page-title">{t['choose_participants']}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-deck row-cards">
                                    <div className="col-md-6">
                                        <div class="card mb-3">
                                            <div class="card-header">
                                                <h3 class="card-title">{t['all_users']}</h3>
                                            </div>
                                            <div class="list-group list-group-flush list-group-hoverable">
                                                <div class="list-group-item">
                                                    <div class="input-icon ">
                                                        <input type="text" class="form-control" placeholder={t['search_placeholder']} onInput={(e) => { this.search(e.target.value) }} />
                                                        <span class="input-icon-addon">

                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {this.userItems(this.state.users)}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div class="card mb-3">
                                            <div class="card-header">
                                                <h3 class="card-title">{t['participants']}</h3>
                                            </div>
                                            <div class="list-group list-group-flush list-group-hoverable">
                                                {this.attendanceItems(this.state.attendances)}
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




