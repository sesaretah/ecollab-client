import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import { conf } from '../../conf';
import $ from 'jquery';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
var t = dict['farsi']

export default class UserWizard extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            email: null,
            password: null,
            verify: false,
            verification: null,
        }

    }



    componentWillMount() {
        ModelStore.on("set_instance", this.setInstance);
        t = dict[this.state.lang]
    }

    componentWillUnmount() {
        ModelStore.removeListener("set_instance", this.setInstance);
    }

    componentDidMount() {
        document.dir = this.state.dir
    }



    handleChange(obj) {
        this.setState(obj);
        if (Object.keys(obj) && Object.keys(obj)[0] && Object.keys(obj)[0] === 'verification') {
            if (obj['verification'].length < 6) {
                this.setState({ disableSubmit: true });
                $('#verification').addClass(' is-invalid ')
            } else {
                this.setState({ disableSubmit: false });
                $('#verification').removeClass(' is-invalid ').addClass(' is-valid ')
            }
        }
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Login') {
            window.localStorage.setItem('token', model.token);
            this.props.history.push("/#/events")
        }
        if (klass === 'VERIFY') {
            this.setState({ verify: true })
        }
    }


    submit() {
        var data = this.state
        MyActions.setInstance('users/login', data);
    }

    verifyForm() {
        if (this.state.verify) {
            return (
                <div class="mb-3">
                    <label class="form-label">{t['verfication_code']}</label>
                    <input type="text" id='verification' onInput={(e) => { this.handleChange({ verification: e.target.value }) }} class="form-control ps-1 is-invalid" autocomplete="off" />
                </div>
            )
        }
    }

    verified() {
        if (this.state.verify) {
            return (
                <div class="alert alert-important alert-danger alert-dismissible" role="alert">
                    <div class="d-flex">
                        <div>
                        </div>
                        <div>
                            <p>{t['your_account_is_not_verified']}</p>
                            <p>{t['check_your_spam_folder']}</p>
                        </div>
                    </div>
                    <a class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="close"></a>
                </div>
            )
        }

    }

    languageBtn() {
        return (

                    <div class="dropdown">
                        <button type="button" onClick={() => this.setState({ langBtnActive: !this.state.langBtnActive })} className={this.state.langBtnActive ? "btn btn-secondary dropdown-toggle show" : "btn btn-secondary dropdown-toggle"} data-bs-toggle="dropdown">
                            <span className='mx-1'>Language</span>
                             <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7h7m-2 -2v2a5 8 0 0 1 -5 8m1 -4a7 4 0 0 0 6.7 4" /><path d="M11 19l4 -9l4 9m-.9 -2h-6.2" /></svg>
                        </button>
                        <div className={this.state.langBtnActive ? "dropdown-menu show" : "dropdown-menu"}>
                            <a class="dropdown-item" onClick={() => this.changeLang('farsi', 'rtl')}>
                                فارسی
                            </a>
                            <a class="dropdown-item" onClick={() => this.changeLang('english', 'ltr')}>
                                English
                            </a>
                        </div>
                    </div>


        )
    }

    changeLang(lang, dir) {
        window.localStorage.setItem('lang', lang)
        window.localStorage.setItem('dir', dir)
        window.location.reload()
    }

    

    render() {
        return (
            <div class="page page-center">
                <div class="container-tight py-4">
                    <React.Fragment>
                        <div class="text-center mb-4">

                        </div>
                        <div class="card card-md">
                            <div class="card-body text-center py-4 p-sm-5">
                                {this.languageBtn()}
                                <h1 class="mt-5">{t['welcome']}</h1>
                                <p class="text-muted">{t['welcome_note']}</p>
                                <p class="text-muted">{t['if_not_registered']}</p>
                                <a href="/#/wizard" class="btn btn-outline-primary w-100">
                                    {t['sign_up']}
                                </a>
                            </div>

                            <div class="hr-text hr-text-center hr-text-spaceless">{t['login_now']}</div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label">{t['your_email']}</label>
                                    <div class="input-group input-group-flat">
                                        <span class="input-group-text"></span>
                                        <input type="text" onInput={(e) => { this.handleChange({ email: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                                    </div>
                                    <div class="form-hint"></div>
                                </div>


                                <div class="mb-3">
                                    <label class="form-label">{t['password']}</label>
                                    <div class="input-group input-group-flat">
                                        <span class="input-group-text"></span>
                                        <input type="password" onInput={(e) => { this.handleChange({ password: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                                    </div>
                                </div>

                                {this.verifyForm()}
                            </div>
                        </div>
                        {this.verified()}
                        <div class="row align-items-center mt-3">
                            <div class="col-4">

                            </div>
                            <div class="col">
                                <div class="btn-list justify-content-end">
                                    <a href="https://auth.ut.ac.ir:8443/cas/login?service=https%3A%2F%2Fevent.ut.ac.ir%2Fusers%2Fservice" class="btn bg-green-lt">
                                        {t['cas']}
                                    </a>

                                    <button onClick={() => this.submit()} class="btn btn-primary">
                                        {t['login']}
                                    </button>


                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                </div>
            </div>
        )
    }
}




