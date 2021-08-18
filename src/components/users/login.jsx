import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import { conf } from '../../conf';
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
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Login') {
            window.localStorage.setItem('token', model.token);
            this.props.history.push("/#/events")
        }
    }


    submit() {
        var data = this.state
        MyActions.setInstance('users/login', data);
    }

    render() {
        return (
            <div class="page page-center">
                <div class="container-tight py-4">
                    <React.Fragment>
                        <div class="text-center mb-4">
                            <a href="."><img src="./static/logo.svg" height="36" alt="" /></a>
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
                            </div>
                        </div>
                        <div class="row align-items-center mt-3">
                            <div class="col-4">

                            </div>
                            <div class="col">
                                <div class="btn-list justify-content-end">
                                    <a href="https://auth.ut.ac.ir:8443/cas/login?service=https%3A%2F%2Fevent.ut.ac.ir%2Fusers%2Fservice" class="btn bg-azure-lt">
                                        {t['cas']}
                                    </a>

                                    <button onClick={() => this.submit()} class="btn btn-success">
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




