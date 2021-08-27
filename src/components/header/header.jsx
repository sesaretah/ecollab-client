import React from 'react'
import { useHistory } from "react-router-dom";
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
const t = dict['fa']
export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.getInstance = this.getInstance.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            profile: { name: '', initials: '' },
            userAbilities: null,
        }

    }


    componentWillMount() {
        ModelStore.on("got_instance", this.getInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_instance", this.getInstance);
    }

    componentDidMount() {
        if (this.state.token && this.state.token.length > 10) {
            MyActions.getInstance('profiles/my', 1, this.state.token);
        } else {
            this.props.history.push("login")
        }

    }

    getInstance() {
        var profile = ModelStore.getIntance()
        var klass = ModelStore.getKlass()
        if (profile && klass === 'Profile') {
            this.setState({
                profile: profile,
                userAbilities: profile.abilities
            });
        }
    }



    handleChange(obj) {

    }

    logout() {
        this.setState({ token: null });
        window.localStorage.removeItem('token');
        window.location.replace('/')
    }

    settingsBtn() {
        if (this.state.userAbilities && this.state.userAbilities.administration) {
            return (
                <li className="nav-item">
                    <a className="nav-link" href="/#/settings">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><circle cx="12" cy="12" r="3" /></svg>
                        </span>
                        <span className="nav-link-title">{t['settings']}</span>
                    </a>
                </li>
            )
        }
    }




    render() {
        const t = dict['fa']
        return (
            <header className="navbar navbar-expand-md navbar-dark d-print-none">
                <div className="container-xl">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbar-menu"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                        <a href="/#/"></a>
                    </h1>
                    <div className="navbar-nav flex-row order-md-last">

                        <div className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link d-flex lh-1 text-reset p-0"
                                data-bs-toggle="dropdown"
                                aria-label="Open user menu"
                            >
                                <span className="avatar avatar-sm">{this.state.profile.initials}</span>
                                <div className="d-xl-block ps-2">
                                    <div>{this.state.profile.name}</div>
                                    <div className="mt-1 small text-muted"></div>
                                </div>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                <a onClick={() => this.logout()} className="dropdown-item">
                                    {t['logout']}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse" id="navbar-menu">
                        <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="/#/">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <polyline points="5 12 3 12 12 3 21 12 19 12" />
                                                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                                            </svg>
                                        </span>
                                        <span className="nav-link-title">{t['home']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/#/events">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><rect x="8" y="15" width="2" height="2" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['events']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/#/meetings">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="4" x2="21" y2="4" /><path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" /><path d="M8 12l3 -3l2 2l3 -3" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['meetings']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/#/exhibitions">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><line x1="3.6" y1="9" x2="20.4" y2="9" /><line x1="3.6" y1="15" x2="20.4" y2="15" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['exhibitions']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/#/calendar">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="11" y1="15" x2="12" y2="15" /><line x1="12" y1="15" x2="12" y2="18" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['my_calendar']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/#/profiles">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['users']}</span>
                                    </a>
                                </li>

                                {this.settingsBtn()}






                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}




