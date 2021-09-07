import React from 'react'
//import '../../css/demo.min.css';
//import '../../css/tabler.min.css';
import { useHistory } from "react-router-dom";
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
var t = dict['farsi']
export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.getInstance = this.getInstance.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            profile: { name: '', initials: '' },
            userAbilities: null,
            event_name: '',

            langBtnActive: false,
        }

    }


    componentWillMount() {
        ModelStore.on("got_instance", this.getInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_instance", this.getInstance);
    }

    componentDidMount() {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&', this.state.lang)
        if(!this.state.lang || this.state.lang === '' ){
            this.changeLang('farsi', 'rtl')
        }
        t = dict[this.state.lang]
        if (this.state.token && this.state.token.length > 10) {
            MyActions.getInstance('profiles/my', 1, this.state.token);
        } else {
            this.props.history.push("login")
        }
        document.dir = this.state.dir


        var location = window.location.href.split('#')[0].split('/')
        var event_name = location[3]
        this.setState({ event_name: event_name })
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

    eventsBtn() {
        if (this.state.event_name === '') {
            return (
                <li className="nav-item">
                    <a className="nav-link" href="/#/events">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><rect x="8" y="15" width="2" height="2" /></svg>
                        </span>
                        <span className="nav-link-title">{t['events']}</span>
                    </a>
                </li>
            )
        }
    }

    languageBtn() {
        return (
            <div className="navbar-nav flex-row order-md-1">
                <div className="nav-item">
                    <div class="dropdown">
                        <button type="button" onClick={() => this.setState({ langBtnActive: !this.state.langBtnActive })} className={this.state.langBtnActive ? "btn btn-secondary dropdown-toggle show" : "btn btn-secondary dropdown-toggle"} data-bs-toggle="dropdown">
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
                </div>
            </div>

        )
    }

    changeLang(lang, dir) {
        window.localStorage.setItem('lang', lang)
        window.localStorage.setItem('dir', dir)
        window.location.reload()
    }


    eventBadge() {
        if (this.state.event_name !== '') {
            return (
                <div className="navbar-nav flex-row mx-2 order-md-2">
                    <div className="nav-item">
                        <div className='btn btn-outline-white p-0'>
                            <h4 className='mx-2' style={{ padding: '7px', margin: '0px' }}>{this.state.event_name}</h4>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon text-pink" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><rect x="8" y="15" width="2" height="2" /></svg>
                        </div>
                    </div>
                </div>
            )
        }

    }

    render() {
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
                    <div className="navbar-nav flex-row order-md-last mx-2">
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

                    {this.languageBtn()}
                    {this.eventBadge()}

                    <div className="collapse navbar-collapse" id="navbar-menu">
                        <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="#/">
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

                                {this.eventsBtn()}

                                <li className="nav-item">
                                    <a className="nav-link" href={"#/meetings"}>
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="4" x2="21" y2="4" /><path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" /><path d="M8 12l3 -3l2 2l3 -3" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['meetings']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href={"#/exhibitions"}>
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><line x1="3.6" y1="9" x2="20.4" y2="9" /><line x1="3.6" y1="15" x2="20.4" y2="15" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['exhibitions']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="#/calendar">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="11" y1="15" x2="12" y2="15" /><line x1="12" y1="15" x2="12" y2="18" /></svg>
                                        </span>
                                        <span className="nav-link-title">{t['my_calendar']}</span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="#/profiles">
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




