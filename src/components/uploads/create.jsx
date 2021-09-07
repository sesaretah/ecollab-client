import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import $ from 'jquery';
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import { conf } from '../../conf';
import queryString from 'query-string'
import axios, { put } from 'axios';
import Validation from "../common/validation.jsx";
import {
    validateExistence
} from "../common/validate.js";

const server = conf.server;
var t = dict['farsi']

export default class UploadCreate extends React.Component {

    constructor(props) {
        super(props);
        this.getInstance = this.getInstance.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.modal = React.createRef();
        this.validateExistence = validateExistence.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            title: null,
            id: null,
            upload_type: 'file',
            file: null,
            progress: 0,
            validationItems: [],
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
        var self = this;
        const value = queryString.parse(this.props.location.search);
        var uploadable_type = '';
        var uploadable_id = 0;
        Object.keys(value).map((key) => {
            var splited = key.split("_")
            if (splited[0]) {
                uploadable_type = splited[0].charAt(0).toUpperCase() + splited[0].slice(1);
                uploadable_id = value[key]
            }
        })
        this.setState({ uploadable_type: uploadable_type, uploadable_id: uploadable_id })
        if (this.props.match.params.id) {
            MyActions.getInstance('uploads', this.props.match.params.id, this.state.token);
        }
    }


    handleChange(obj) {
        this.setState(obj);
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Upload') {
            this.props.history.push('/' + model.advertisable_link)
        }
    }

    getInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (model && klass === 'Upload') {
            this.setState({
                id: model.id,
                title: model.title,
                uploadable_type: model.uploadable_type,
                uploadable_id: model.uploadable_id,
                editing: true,
            })
        }

    }

    changeDefault(e) {
        if (this.state.is_private) {
            this.setState({ is_private: false })
        } else {
            this.setState({ is_private: true })
        }
    }

    changeType(e) {
        var self = this;
        self.setState({ upload_type: e })
    }

    fileAttacher(file) {
        this.setState({ file: file })
    }

    submit() {
        if (this.validateExistence(['title', 'file'])) {
            var self = this;
            $('#submit-button').hide();
            $('#submit-spinner').show();
            self.setState({ progressShow: true }, () => console.log(this.state.progressShow))
            const config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(percentCompleted)
                    self.setState({ progress: percentCompleted })

                },
                headers: { 'Content-Type': 'application/json', 'Authorization': "bearer " + self.state.token }
            }

            let data = new FormData()
            data.append('upload[attached_document]', this.state.file)
            data.append('upload[title]', this.state.title)
            data.append('upload[uploadable_type]', this.state.uploadable_type)
            data.append('upload[uploadable_id]', this.state.uploadable_id)
            data.append('upload[is_private]', this.state.is_private)
            data.append('upload[upload_type]', this.state.upload_type)

            axios.post(conf.server + '/uploads', data, config)
                .then(res => {
                    self.setState({ progressShow: false, uploadedRecently: true });
                    var upload = res.data.data
                    $('#submit-spinner').hide();
                    if (upload.upload_type === 'cover') {
                        this.props.history.push("/uploads/cropper/" + upload.uuid)
                    } else {
                        this.props.history.push('/' + upload.uploadable_link)
                    }
                })
                .catch(err => self.setState({ progressShow: false }))
        }
    }

    render() {
        const { is_private } = this.state;
        return (
            <body className="antialiased">
                <Validation items={this.state.validationItems} modal={this.modal} lang={this.state.lang}/>
                <div className="wrapper">
                    <Header history={this.props.history} />
                    <div className="page-wrapper">
                        <div className="container-xl">
                            <div className="page-header d-print-none">
                                <div className="row align-items-center"></div>
                                <div className="col">
                                    <div className="page-pretitle">{t['create_upload']}</div>
                                    <h2 className="page-title">{t['provide_following_info']}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div className="row row-deck row-cards">
                                    <div class="col-md-8">
                                        <div class="card">
                                            <div class="card-header">
                                                <h3 class="card-title">{t['create_upload']}</h3>
                                            </div>
                                            <div class="card-body">
                                                <form>
                                                    <div class="mb-3">
                                                        <label class="form-label">{t['upload_title']}</label>
                                                        <input type="text" class="form-control" name="text-input" placeholder={t['write_something']} onInput={(e) => { this.handleChange({ title: e.target.value }) }} value={this.state.title} />
                                                    </div>

                                                    <div class="mb-3">
                                                        <label class="form-label">{t['resource_type']}</label>
                                                        <div class="form-selectgroup">
                                                            <label class="form-selectgroup-item">
                                                                <input type="checkbox" name="name" value="cover" class="form-selectgroup-input" checked={this.state.upload_type === 'cover' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                <span class="form-selectgroup-label">{t['cover']}</span>
                                                            </label>
                                                            <label class="form-selectgroup-item">
                                                                <input type="checkbox" name="name" value="file" class="form-selectgroup-input" checked={this.state.upload_type === 'file' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                <span class="form-selectgroup-label">{t['file']}</span>
                                                            </label>
                                                            <label class="form-selectgroup-item">
                                                                <input type="checkbox" name="name" value="video" class="form-selectgroup-input" checked={this.state.upload_type === 'video' ? true : false} onClick={(e) => this.changeType(e.target.value)} />
                                                                <span class="form-selectgroup-label">{t['video']}</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div class="mb-3">
                                                        <div class="form-label">{t['choose_file']}</div>
                                                        <input type="file" class="form-control" onInput={(e) => { this.fileAttacher(e.target.files[0]); }} />
                                                    </div>


                                                    <div class="mb-3">
                                                        <div class="form-label">{t['is_private']}</div>
                                                        <label class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" onClick={(e) => this.changeDefault(e.target.value)} checked={is_private ? true : false} />
                                                            <span class="form-check-label">{t['default_is_private_upload']}</span>
                                                        </label>
                                                    </div>





                                                </form>
                                            </div>
                                            <div class="card-footer">
                                                <div class="d-flex">
                                                    <a href="/#/meetings" class="btn btn-link">{t['cancel']}</a>
                                                    <button id='submit-button' onClick={() => this.submit()} class="btn btn-primary ms-auto">
                                                        {t['submit']}
                                                    </button>
                                                    <div id='submit-spinner' class="spinner-border text-red ms-auto" role="status" style={{ display: 'none' }}></div>
                                                </div>
                                            </div>
                                            <div class="progress progress-sm card-progress">
                                                <div class="progress-bar" style={{ width: this.state.progress + "%" }} role="progressbar" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100">
                                                    <span class="visually-hidden">38% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card">
                                            <div class="card-status-top bg-lime"></div>
                                            <div class="card-body">
                                                <h3 class="card-title"></h3>
                                                <p></p>
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




