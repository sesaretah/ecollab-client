import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import $ from 'jquery';
import queryString from 'query-string'
import Header from "../header/header.jsx";
import PollCard from "../polls/create.jsx";
var t = dict['farsi'];

export default class PollIndex extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getList = this.getList.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.deleteInstance = this.deleteInstance.bind(this);

        
        this.state = {
            token: window.localStorage.getItem('token'),
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            pollable_type: null,
            pollable_id: null,
            answer_type: 'star',
            polls: null,
            content: null,
            answer_content: null,
            title: null,
            formActivated: false,
            poll: null,
            star: null,
        }

    }



    componentWillMount() {
        ModelStore.on("got_list", this.getList);
        ModelStore.on("set_instance", this.setInstance);
        ModelStore.on("got_instance", this.getInstance);
        ModelStore.on("deleted_instance", this.deleteInstance);

    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
        ModelStore.removeListener("set_instance", this.setInstance);
        ModelStore.removeListener("got_instance", this.getInstance);
        ModelStore.removeListener("deleted_instance", this.deleteInstance);
    }

    componentDidMount() {
        t = dict[this.state.lang]
        var self = this;
        const value = queryString.parse(this.props.location.search);
        var pollable_type = '';
        var pollable_id = 0;
        var plural = ''
        Object.keys(value).map((key) => {
            var splited = key.split("_")
            if (splited[0]) {
                pollable_type = splited[0].charAt(0).toUpperCase() + splited[0].slice(1);
                pollable_id = value[key]
                plural = splited[0] + 's'
            }
        })
        this.setState({ pollable_type: pollable_type, pollable_id: pollable_id }, () => {
            MyActions.getList('polls', this.state.page, { pollable_type: pollable_type, pollable_id: pollable_id }, this.state.token);
            MyActions.getInstance(plural, pollable_id, this.state.token);
        })

    }

    deleteInstance() {
        
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Poll') {
            MyActions.getList('polls', this.state.page, { pollable_type: this.state.pollable_type, pollable_id: this.state.pollable_id }, this.state.token);
        }
    }

    getList() {
        var list = ModelStore.getList()
        var klass = ModelStore.getKlass()

        if (list && klass === 'Poll') {
            this.setState({
                polls: list,
            });
        }
        console.log(list)
    }

    getInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Meeting' || klass === 'Event') {
            this.setState({
                title: model.title,
                is_admin: model.is_admin
            });
        }
        if (klass === 'Poll') {
            this.setState({
                poll: model,
            });
        }
        console.log(model)
    }

    handleChange(obj) {
        this.setState(obj);
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Poll') {
            this.clearForm();
            MyActions.getList('polls', this.state.page, { pollable_type: this.state.pollable_type, pollable_id: this.state.pollable_id }, this.state.token);
        }
    }

    changeType(e) {
        this.setState({ answer_type: e })
    }

    selectContent() {
        console.log(this.state.answer_type)
        if (this.state.answer_type && (this.state.answer_type === 'single_select' || this.state.answer_type === 'multiple_select')) {
            return (
                <div class="mb-3">
                    <label class="form-label">{t['select_content']}<span class="form-label-description"></span></label>
                    <textarea onInput={(e) => { this.handleChange({ answer_content: e.target.value }) }} class="form-control text-dark" id='content' name="example-textarea-input" rows="6" placeholder={t['write_something']} value={this.state.answer_content}></textarea>
                    <div class="form-hint">{t['separate_with_enter']}</div>
                </div>
            )
        }
    }

    clearForm() {
        this.setState({
            answer_type: 'star',
            content: null,
            answer_content: null
        });
        $('#content').val('');
    }

    pollItem(item) {
        return (
            <div className="list-group-item">
                <div class="row align-items-center">
                    <div class="col text-truncate">
                        <a onClick={() => this.loadPollings(item.id)} class="text-body d-block">{item.content}</a>
                        <small class="d-block text-muted text-truncate mt-n1"></small>
                    </div>
                    <div class="col-auto">
                        <span class="badge bg-cyan-lt">{t[item.answer_type]}</span>
                        {this.deleteBtn(item.id)}
                    </div>
                </div>
            </div>
        )
    }

    pollsList() {
        var result = []
        if (this.state.polls) {
            this.state.polls.map((item) => {
                result.push(this.pollItem(item))
            })
        }
        return result
    }

    submit() {
        var data = {
            pollable_type: this.state.pollable_type,
            pollable_id: this.state.pollable_id,
            answer_type: this.state.answer_type,
            content: this.state.content,
            answer_content: this.state.answer_content
        }
        MyActions.setInstance('polls', data, this.state.token);
    }

    toggleForm() {
        this.setState({ formActivated: !this.state.formActivated })
    }

    createBtn() {
        if (this.state.is_admin) {
            return (
                <li class="nav-item ms-auto">
                    <a class="nav-link p-1" onClick={() => this.toggleForm()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </a>
                </li>
            )
        }
    }

    loadPollings(id) {
        MyActions.getInstance('polls/overview', id, this.state.token);
    }

    postPolling(id, value) {
        var data = { poll_id: id, outcome: value }
        MyActions.setInstance('pollings', data, this.state.token);
    }

    deletePoll(id) {
        var data = { id: id }
        MyActions.removeInstance('polls', data, this.state.token);
    }


    deleteBtn(id) {
        if (id) {
            return (
                <a onClick={() => { if (window.confirm(t['are_you_sure'])) this.deletePoll(id) }} class=" ms-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                </a>
            )
        }
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
                                    <div className="page-pretitle">{t['overview']}</div>
                                    <h2 className="page-title">{t['polls']}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className='col-md-12'>
                                    <div className="row row-cards">
                                        <div className='col-md-6'>
                                            <div className='card'>
                                                <div className="card-header bg-dark-lt" >
                                                    <h3 class="card-title">{this.state.title}</h3>
                                                    <ul class="nav nav-pills card-header-pills">
                                                        {this.createBtn()}
                                                    </ul>
                                                </div>

                                                <div className={this.state.formActivated ? 'show-element' : 'hide-element'}>
                                                    <div className={"card-body bg-dark text-white"}>
                                                        <form >
                                                            <div class="mb-3">
                                                                <label class="form-label">{t['poll_content']}</label>
                                                                <input id='content' type="text" class="form-control text-dark" name="text-input" placeholder={t['write_something']} onInput={(e) => { this.handleChange({ content: e.target.value }) }} value={this.state.content} />
                                                            </div>
                                                            <div class="mb-3">
                                                                <label class="form-label">{t['answer_type']}</label>
                                                                <div class="form-selectgroup">
                                                                    <label class="form-selectgroup-item">
                                                                        <input type="checkbox" name="name" value="single_select" class="form-selectgroup-input" checked={this.state.answer_type === 'single_select' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                        <span class="form-selectgroup-label">{t['single_select']}</span>
                                                                    </label>
                                                                    <label class="form-selectgroup-item">
                                                                        <input type="checkbox" name="name" value="multiple_select" class="form-selectgroup-input" checked={this.state.answer_type === 'multiple_select' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                        <span class="form-selectgroup-label">{t['multiple_select']}</span>
                                                                    </label>
                                                                    <label class="form-selectgroup-item">
                                                                        <input type="checkbox" name="name" value="star" class="form-selectgroup-input" checked={this.state.answer_type === 'star' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                        <span class="form-selectgroup-label">{t['star']}</span>
                                                                    </label>
                                                                    <label class="form-selectgroup-item">
                                                                        <input type="checkbox" name="name" value="binary" class="form-selectgroup-input" checked={this.state.answer_type === 'binary' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                        <span class="form-selectgroup-label">{t['binary']}</span>
                                                                    </label>
                                                                    <label class="form-selectgroup-item">
                                                                        <input type="checkbox" name="name" value="trinary" class="form-selectgroup-input" checked={this.state.answer_type === 'trinary' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                        <span class="form-selectgroup-label">{t['trinary']}</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            {this.selectContent()}
                                                        </form>
                                                        <div class="d-flex">
                                                            <a onClick={() => { this.clearForm(); this.toggleForm() }} class="btn btn-link">{t['cancel']}</a>
                                                            <button id='submit-button' onClick={() => this.submit()} class="btn btn-primary ms-auto">{t['submit']}</button>
                                                            <div id='submit-spinner' class="spinner-border text-red ms-auto" role="status" style={{ display: 'none' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="list-group list-group-flush list-group-hoverable">
                                                    {this.pollsList()}
                                                </div>
                                            </div>

                                        </div>
                                        <div className='col-md-6'>
                                            <div className='card'>
                                                <div className='card-body' >
                                                    <PollCard postPolling={this.postPolling} disabled={true} star={this.state.star} handleChange={this.handleChange} poll={this.state.poll} lang={this.state.lang}/>
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




