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
const t = dict['fa']

export default class UserWizard extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            email: null,
            password: null,
            verify: false,
            verification: null,
        }

    }



    componentWillMount() {
        ModelStore.on("set_instance", this.setInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("set_instance", this.setInstance);
    }

    componentDidMount() {
        if (this.state.token && this.state.token !== '') {
            //  MyActions.getInstance('profiles/my', '1', this.state.token);
        }
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

    render() {
        return (
            <div class="page page-center">
                <div class="container-tight py-4">
                    <React.Fragment>
                        <div class="text-center mb-4">

                        </div>
                        <div class="card card-md">
                            <div class="card-body text-center py-4 p-sm-5">
                                <img src="./static/illustrations/undraw_sign_in_e6hj.svg" height="128" class="mb-n2" alt="" />
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




