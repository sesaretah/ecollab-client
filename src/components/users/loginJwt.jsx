import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import { conf } from '../../conf';
import queryString from 'query-string'

const t = dict['fa']

export default class LoginJwt extends React.Component {

    constructor(props) {
        super(props);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            token: null,
        }

    }



    componentWillMount() {
        ModelStore.on("set_instance", this.setInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("set_instance", this.setInstance);
    }

    componentDidMount() {
        MyActions.setInstance('users/validate_token', {}, this.props.match.params.id);
    }



    handleChange(obj) {
        this.setState(obj);
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Validate') {
            window.localStorage.setItem('token', model.token);
            this.props.history.push("/#/events")
        }
    }

    render() {
        return (null)
    }
}




