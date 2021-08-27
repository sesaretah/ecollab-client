import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import AbilityCard from "../settings/ability.jsx"
const t = dict['fa']

export default class SettingsIndex extends React.Component {

    constructor(props) {
        super(props);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.userAbility = this.userAbility.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.changeAbility = this.changeAbility.bind(this);
        this.submitAbility = this.submitAbility.bind(this);
        
        
        this.state = {
            token: window.localStorage.getItem('token'),
            profiles: [],
            selectedAbility: null,
            profile: null,
            userAbilities: null,
        }

    }



    componentWillMount() {
        ModelStore.on("got_list", this.getList);
        ModelStore.on("got_instance", this.getInstance);
        

    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
        ModelStore.removeListener("got_instance", this.getInstance);
    }

    componentDidMount() {
        if (this.state.token && this.state.token.length > 10) {
            MyActions.getInstance('profiles/my', 1, this.state.token);
        } else {
            this.props.history.push("login")
        }
    }



    handleChange(obj) {
        this.setState(obj);
    }

    searchUser(q) {
        if (q.length > 2) {
            var data = { q: q }
            MyActions.getList('profiles/search', this.state.page, data, this.state.token);
        } else {
            this.setState({ profiles: [] })
        }

    }

    getInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Ability') {
            this.setState({ selectedAbility: model });
        }
        if (model && klass === 'Profile') {
            this.setState({
                profile: model,
                userAbilities: model.abilities
            });
            if (model.abilities && !model.abilities.administration) {
                this.props.history.push("/#/")
            }
        }
       
    }

    getList() {
        var list = ModelStore.getList()
        var klass = ModelStore.getKlass()
        if (list && klass === 'Profile') {
            this.setState({ profiles: list })
        }
    }

    userAbility(user_id) {
        MyActions.getInstance('abilities', user_id, this.state.token);
    }

    changeAbility(key, value) {
        var selectedAbility = this.state.selectedAbility
        selectedAbility[key] = JSON.parse(value.toLowerCase()); 
        this.setState({ selectedAbility: selectedAbility })
    }

    submitAbility(){
        MyActions.updateInstance('abilities', this.state.selectedAbility, this.state.token);
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
                                    <h2 className="page-title">{t['settings']}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-cards">
                                    <div className="col-md-3">
                                        <div className='card'>
                                            <div className='card-header bg-dark-lt'>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><circle cx="12" cy="12" r="3" /></svg>
                                                {t['settings']}
                                            </div>
                                            <div className='list-group list-group-flush'>
                                                <div class="list-group-item">
                                                    <div class="row align-items-center">
                                                        <div class="col text-truncate">
                                                            <a href="#" class="text-body d-block">{t['abilities']}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="list-group-item">
                                                    <div class="row align-items-center">
                                                        <div class="col text-truncate">
                                                            <a href="#" class="text-body d-block">{t['restrictions']}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="list-group-item">
                                                    <div class="row align-items-center">
                                                        <div class="col text-truncate">
                                                            <a href="#" class="text-body d-block">{t['reports']}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <AbilityCard
                                            profiles={this.state.profiles}
                                            selectedAbility={this.state.selectedAbility}
                                            searchUser={this.searchUser}
                                            userAbility={this.userAbility}
                                            changeAbility={this.changeAbility}
                                            submitAbility={this.submitAbility}
                                        />
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




