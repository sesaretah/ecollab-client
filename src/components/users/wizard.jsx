import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import $ from 'jquery';
import { dict } from '../../Dict';
import { conf } from '../../conf';
import Validation from "../common/validation.jsx";
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
import {
    validateExistence
} from "../common/validate.js";

const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
var t = dict['farsi']




export default class UserWizard extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.modal = React.createRef();
        this.validateExistence = validateExistence.bind(this);

        
        this.state = {
            token: window.localStorage.getItem('token'),
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            email: null,
            name: null,
            password: null,
            password_confirmation: null,
            id: null,
            bio: null,
            country: null,
            initials: 'NN',
            options: [],
            tags: [],
            validationItems: [],
            disableSubmit: true,
        }

    }



    componentWillMount() {
        ModelStore.on("set_instance", this.setInstance);
        ModelStore.on("got_instance", this.getInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("set_instance", this.setInstance);
        ModelStore.removeListener("got_instance", this.getInstance);
    }

    componentDidMount() {
        t = dict[this.state.lang]
        if (this.state.token && this.state.token !== '') {
            MyActions.getInstance('profiles/my', '1', this.state.token);
        }
    }

    getInstance() {
        var profile = ModelStore.getIntance()
        var klass = ModelStore.getKlass()
        if (profile && klass === 'Profile') {
            this.setState({
                id: profile.id,
                name: profile.name,
                bio: profile.bio,
                country: profile.country,
                initials: profile.initials,
                tags: profile.tags
            })
            console.log(profile.tags)
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    handleChange(obj) {
        this.setState(obj);
        if(Object.keys(obj) && Object.keys(obj)[0] && Object.keys(obj)[0]=== 'password_confirmation') {
            if (obj['password_confirmation'] !== this.state.password){
                this.setState({disableSubmit: true});
                $('#password_confirmation').addClass(' is-invalid ')
            } else {
                this.setState({disableSubmit: false});
                $('#password_confirmation').removeClass(' is-invalid ').addClass(' is-valid ')
            }
        }

        if(Object.keys(obj) && Object.keys(obj)[0] && Object.keys(obj)[0]=== 'password') {
            if (obj['password'].length < 8){
                this.setState({disableSubmit: true});
                $('#password').addClass(' is-invalid ')
            } else {
                this.setState({disableSubmit: false});
                $('#password').removeClass(' is-invalid ').addClass(' is-valid ')
            }
        }

        if(Object.keys(obj) && Object.keys(obj)[0] && Object.keys(obj)[0]=== 'email') {
            if (!this.validateEmail(obj['email'])){
                this.setState({disableSubmit: true});
                $('#email').addClass(' is-invalid ')
            } else {
                this.setState({disableSubmit: false});
                $('#email').removeClass(' is-invalid ').addClass(' is-valid ')
            }
        }
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'SignUp') {
            window.localStorage.setItem('token', model.token);
            window.location.reload()
        }
        if (klass === 'Profile') {
            this.props.history.push("/#/")
        }
    }


    submit() {
        if (this.validateExistence(['email', 'name', 'password', 'password_confirmation'])) {
            $('#submit-button').hide();
            $('#submit-spinner').show();
            var data = this.state
            MyActions.setInstance('users/sign_up', data);
        }
    }

    submitProfile() {
        var data = this.state
        MyActions.updateInstance('profiles', data, this.state.token);
    }

    tagSelected(tags) {
        var result = []
        tags.map((tag) => {
            if (tag['title']) {
                result.push(tag['title'])
            } else {
                result.push(tag)
            }
        })
        this.setState({ tags: result }, () => console.log(this.state.tags))
    }

    checkSignUp() {
        if (!this.state.token || this.state.token === '') {
            return (this.notSignedUp())
        } else {
            return (this.signedUp())
        }
    }

    notSignedUp() {
        return (
            <React.Fragment>
                <div class="text-center mb-4">
                    <a href="."><img src="./static/logo.svg" height="36" alt="" /></a>
                </div>
                <div class="card card-md">
                    <div class="card-body text-center py-4 p-sm-5">
                        <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt="" />
                        <h1 class="mt-5">{t['welcome']}</h1>
                        <p class="text-muted">{t['welcome_note']}</p>
                        <p class="text-muted">{t['login_if_registered']}</p>
                        <a href="/#/login" class="btn btn-outline-success w-100">
                            {t['login']}
                        </a>
                    </div>
                    <div class="hr-text hr-text-center hr-text-spaceless">{t['sign_up_now']}</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">{t['your_email']}</label>
                                <input type="text" id='email' name='email' onInput={(e) => { this.handleChange({ email: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                            <div class="form-hint"></div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">{t['your_name']}</label>
                            <div class="input-group input-group-flat">
                                <span class="input-group-text"></span>
                                <input type="text" name='fullname' onInput={(e) => { this.handleChange({ name: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                            </div>
                            <div class="form-hint"></div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">{t['choose_password']}</label>
                                <input type="password" id='password' onInput={(e) => { this.handleChange({ password: e.target.value }) }} class="form-control ps-1 is-valid" autocomplete="off" />
                            <div class="form-hint">{t['password_rule']}</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">{t['repeat_password']}</label>

                                <input type="password" id='password_confirmation' onInput={(e) => { this.handleChange({ password_confirmation: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                            <div class="form-hint"></div>
                        </div>

                    </div>
                </div>
                <div class="row align-items-center mt-3">
                    <div class="col-4">
                        <div class="progress">
                            <div class="progress-bar" style={{ width: "25%" }} role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="visually-hidden">25% Complete</span>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="btn-list justify-content-end">
                            <button id='submit-button' onClick={() => this.submit()} disabled={this.state.disableSubmit} class="btn btn-primary">
                                {t['sign_up_and_continue']}
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    signedUp() {
        if (this.state.id) {
            return (
                <React.Fragment>
                    <div class="card card-md">
                        <div class="card-body text-center py-4 p-sm-5">
                            <span class="avatar avatar-xl mb-2 avatar-rounded">{this.state.initials}</span>
                            <p class="text-muted"></p>
                        </div>

                        <div class="hr-text hr-text-center hr-text-spaceless">{t['complete_your_profile']}</div>

                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">{t['your_country']}</label>
                                <div class="input-group input-group-flat">
                                    <span class="input-group-text"></span>
                                    <CountryDropdown classes={"form-control ps-1"} priorityOptions={['CA', 'IR', 'US']} value={this.state.country} onChange={(val) => this.handleChange({ country: val })} />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">{t['bio']}<span class="form-label-description"></span></label>
                                <textarea
                                    class="form-control"
                                    name="example-textarea-input"
                                    rows="6"
                                    placeholder={t['write_about_yourself']}
                                    onInput={(e) => { this.handleChange({ bio: e.target.value }) }}
                                    value={this.state.bio}>
                                </textarea>
                            </div>
                            <div class="mb-3">
                            <label class="form-label" >{t['tags']}</label>
                                <AsyncTypeahead
                                    id='yytyty'
                                    allowNew
                                    multiple
                                    defaultSelected={this.state.tags}
                                    isLoading={this.state.isLoading}
                                    labelKey='title'
                                    onSearch={(query) => {
                                        this.setState({ isLoading: true });
                                        fetch(server + "/tags/search?q=" + query)
                                            .then((resp) => resp.json())
                                            .then(({ items }) => {
                                                this.setState({ options: items, isLoading: false }, () => console.log(this.state.options))
                                            });
                                    }}
                                    onChange={(t) => this.tagSelected(t)}
                                    options={this.state.options}
                                    renderMenuItemChildren={(option, props) => (
                                        <React.Fragment>
                                            <span>{option.title}</span>
                                        </React.Fragment>
                                    )}
                                />
                            </div>

                        </div>
                    </div>
                    <div class="row align-items-center mt-3">
                        <div class="col-4">
                            <div class="progress">
                                <div class="progress-bar" style={{ width: "75%" }} role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                    <span class="visually-hidden">25% Complete</span>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="btn-list justify-content-end">
                                <button onClick={() => this.submitProfile()} class="btn btn-primary">
                                   {t['continue']}
                                </button>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }


    render() {
        return (
            <div class="page page-center">
                <Validation items={this.state.validationItems} modal={this.modal} lang={this.state.lang} />
                <div class="container-tight py-4">
                    {this.checkSignUp()}

                </div>
            </div>
        )
    }
}




