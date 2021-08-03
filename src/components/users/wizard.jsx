import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import { conf } from '../../conf';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;

export default class UserWizard extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            email: null,
            name: null,
            password: null,
            password_confirmation: null,
            id: null,
            bio: null,
            country: null,
            initials: 'NN',
            options: [],
            tags: []
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


    handleChange(obj) {
        this.setState(obj);
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
        var data = this.state
        MyActions.setInstance('users/sign_up', data);
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
                        <h1 class="mt-5">Welcome to Tabler!</h1>
                        <p class="text-muted">Tabler comes with tons of well-designed components and features. Start your adventure with Tabler and make your dashboard great again.</p>
                    </div>
                    <div class="hr-text hr-text-center hr-text-spaceless">Sign Up now!</div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Your email</label>
                            <div class="input-group input-group-flat">
                                <span class="input-group-text"></span>
                                <input type="text" onInput={(e) => { this.handleChange({ email: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                            </div>
                            <div class="form-hint"></div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Your name</label>
                            <div class="input-group input-group-flat">
                                <span class="input-group-text"></span>
                                <input type="text" onInput={(e) => { this.handleChange({ name: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                            </div>
                            <div class="form-hint"></div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Choose a password</label>
                            <div class="input-group input-group-flat">
                                <span class="input-group-text"></span>
                                <input type="text" onInput={(e) => { this.handleChange({ password: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                            </div>
                            <div class="form-hint">Password should be at least 8 characters.</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Repeat your password</label>
                            <div class="input-group input-group-flat">
                                <span class="input-group-text"></span>
                                <input type="text" onInput={(e) => { this.handleChange({ password_confirmation: e.target.value }) }} class="form-control ps-1" autocomplete="off" />
                            </div>
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
                            <button onClick={() => this.submit()} class="btn btn-primary">
                                Sign Up and Continue
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
                            <p class="text-muted">Click to change your profile picture</p>
                        </div>

                        <div class="hr-text hr-text-center hr-text-spaceless">Complete your profile</div>

                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">Your country</label>
                                <div class="input-group input-group-flat">
                                    <span class="input-group-text"></span>
                                    <CountryDropdown classes={"form-control ps-1"} priorityOptions={['CA', 'IR', 'US']} value={this.state.country} onChange={(val) => this.handleChange({ country: val })} />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Bio<span class="form-label-description"></span></label>
                                <textarea
                                    class="form-control"
                                    name="example-textarea-input"
                                    rows="6"
                                    placeholder="Write about your self ..."
                                    onInput={(e) => { this.handleChange({ bio: e.target.value }) }}
                                    value={this.state.bio}>
                                </textarea>
                            </div>
                            <div class="mb-3">
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
                                <a href="/#/" class="btn btn-link link-secondary">
                                    Complete later
                                </a>
                                <button onClick={() => this.submitProfile()} class="btn btn-primary">
                                    Continue
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
                <div class="container-tight py-4">
                    {this.checkSignUp()}

                </div>
            </div>
        )
    }
}




