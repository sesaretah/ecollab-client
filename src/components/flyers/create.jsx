import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import $ from 'jquery';
import { dict } from '../../Dict';
import Header from "../header/header.jsx";
import Validation from "../common/validation.jsx";
import { conf } from '../../conf';
import queryString from 'query-string'
import Quill from 'quill';
import ImageUploader from "quill-image-uploader";
import axios, { put } from 'axios';
import {
    validateExistence
} from "../common/validate.js";

const server = conf.server;

export default class FlyerCreate extends React.Component {

    constructor(props) {
        super(props);
        this.getInstance = this.getInstance.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.modal = React.createRef();
        this.validateExistence = validateExistence.bind(this);

        this.state = {
            token: window.localStorage.getItem('token'),
            title: null,
            id: null,
            content: null,
            advertisable_type: null,
            advertisable_id: null,
            quill: null,
            quill_content: {},
            editing: false,
            is_default: false,
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
        var self = this;
        const value = queryString.parse(this.props.location.search);
        var advertisable_type = '';
        var advertisable_id = 0;
        Object.keys(value).map((key) => {
            var splited = key.split("_")
            if (splited[0]) {
                advertisable_type = splited[0].charAt(0).toUpperCase() + splited[0].slice(1);
                advertisable_id = value[key]
            }
        })
        this.setState({ advertisable_type: advertisable_type, advertisable_id: advertisable_id })
        if (this.props.match.params.id) {
            MyActions.getInstance('flyers', this.props.match.params.id, this.state.token);
        }
        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'ltr' }, { 'direction': 'rtl' }],                         // text direction
            ['image'],
            ['video'],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
        ];
        Quill.register("modules/imageUploader", ImageUploader);
        var quillOne = new Quill('#editor-one', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                imageUploader: {
                    upload: (file) => {
                        return new Promise((resolve, reject) => {
                            const url = server + '/uploads';
                            const formData = new FormData();
                            formData.append('upload[attached_document]', file)
                            //formData.append('profile[id]',id)
                            const config = {
                                headers: {
                                    'content-type': 'multipart/form-data',
                                    'Authorization': "bearer " + this.state.token
                                }
                            }
                            axios.post(url, formData, config).then(function (response) {
                                resolve(response.data.data.link)
                            })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        });
                    },
                },
            },
        });

        quillOne.on('text-change', function (delta, oldDelta, source) {
            if (source == 'api') {
                // console.log("An API call triggered this change.");
            } else if (source == 'user') {
                self.setState({ quill_content: quillOne.getContents(), content: quillOne.getText() })
                // console.log("A user action triggered this change.");
            }
        });



        this.setState({ quill: quillOne })
    }


    handleChange(obj) {
        this.setState(obj);
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Flyer') {
            this.props.history.push('/' + model.advertisable_link)
        }
    }

    getInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (model && klass === 'Flyer') {
            this.setState({
                id: model.id,
                title: model.title,
                content: model.content,
                advertisable_type: model.advertisable_type,
                advertisable_id: model.advertisable_id,
                quill_content: model.quill_content,
                is_default: model.is_default,
                editing: true,
            }, () => {
                console.log(this.state)
                this.state.quill.setContents(this.state.quill_content)
            })
        }

    }

    submit() {
        var data = {
            id: this.state.id,
            title: this.state.title,
            content: this.state.content,
            advertisable_type: this.state.advertisable_type,
            advertisable_id: this.state.advertisable_id,
            quill_content: this.state.quill_content,
            is_default: this.state.is_default,
        }
        if (this.validateExistence(['title'])) {
            $('#submit-button').hide();
            $('#submit-spinner').show();
            if (!this.state.editing) {
                MyActions.setInstance('flyers', data, this.state.token);
            } else {
                MyActions.updateInstance('flyers', data, this.state.token);
            }
        }

    }

    changeDefault(e) {
        console.log(e)
        var self = this;
        if (this.state.is_default) {
            this.setState({ is_default: false })
        } else {
            this.setState({ is_default: true })
        }
    }


    render() {
        const { is_default } = this.state;
        const t = dict['fa'];
        return (
            <body className="antialiased">
                <Validation items={this.state.validationItems} modal={this.modal}/>
                <div className="wrapper">
                    <Header history={this.props.history} />
                    <div className="page-wrapper">
                        <div className="container-xl">
                            <div className="page-header d-print-none">
                                <div className="row align-items-center"></div>
                                <div className="col">
                                    <div className="page-pretitle">{t['create_page']}</div>
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
                                                <h3 class="card-title">{t['create_page']}</h3>
                                            </div>
                                            <div class="card-body">
                                                <form>
                                                    <div class="mb-3">
                                                        <label class="form-label">{t['page_title']}</label>
                                                        <input type="text" class="form-control" name="text-input" placeholder={t['write_something']} onInput={(e) => { this.handleChange({ title: e.target.value }) }} value={this.state.title} />
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label">{t['page_content']}<span class="form-label-description"></span></label>
                                                        <div id="editor-one"></div>
                                                    </div>
                                                    <div class="mb-3">
                                                        <div class="form-label">{t['default_page']}</div>
                                                        <label class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" onClick={(e) => this.changeDefault(e.target.value)} checked={is_default ? true : false} />
                                                            <span class="form-check-label">{t['default_page_info']}</span>
                                                        </label>
                                                    </div>




                                                </form>
                                            </div>
                                            <div class="card-footer">
                                                <div class="d-flex">
                                                    <a href="/#/meetings" class="btn btn-link">{t['cancel']}</a>
                                                    <button id='submit-button' onClick={() => this.submit()} class="btn btn-primary ms-auto">{t['submit']}</button>
                                                    <div id='submit-spinner' class="spinner-border text-red ms-auto" role="status" style={{ display: 'none' }}></div>
                                                </div>
                                            </div>
                                            <div class="progress progress-sm card-progress">
                                                <div class="progress-bar" style={{ width: "100%" }} role="progressbar" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100">
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




