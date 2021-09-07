import React, { Component } from 'react';
import { render } from 'react-dom';
import { dict } from '../../Dict';
import { conf } from "../../conf";
import Quill from 'quill';
import $ from 'jquery';
var t = dict['farsi']
class FlyerCard extends Component {
    constructor(props) {
        super(props);


        this.state = {
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            quillOne: null,
            cover: null,
            qillLoaded: false,

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.quill_content !== this.props.quill_content) {
            //console.log('*****', this.props.quill_content)
            // if(this.state.quillOne){
            this.state.quillOne.setContents(this.props.quill_content)
            this.state.quillTwo.setContents(this.props.quill_content)
            this.setState({ qillLoaded: true })
            // }

        }
        if (prevProps.cover !== this.props.cover) {
            this.setState({ cover: this.props.cover })
        }
    }

    componentWillUnmount() {

    }




    componentDidMount() {
        t = dict[this.state.lang]
        var quillOne = new Quill('#editor-one', {
            readOnly: true,
        });
        var quillTwo = new Quill('#editor-two', {
            readOnly: true,
        });
        this.setState({ quillOne: quillOne, quillTwo: quillTwo })
    }


    cardCover() {
        if (this.state.cover) {
            return (<div class="card-img-top img-responsive img-responsive-16by9" style={{ backgroundImage: "url(" + this.state.cover + ")" }}></div>)
        }
    }

    maximizeBtn() {
        if (this.state.qillLoaded) {
            if ($('.ql-video').length) {
                return (
                    <React.Fragment>
                        <a href="#" class="btn btn-white" data-bs-toggle="modal" data-bs-target="#modal-large">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="16 4 20 4 20 8" /><line x1="14" y1="10" x2="20" y2="4" /><polyline points="8 20 4 20 4 16" /><line x1="4" y1="20" x2="10" y2="14" /><polyline points="16 20 20 20 20 16" /><line x1="14" y1="14" x2="20" y2="20" /><polyline points="8 4 4 4 4 8" /><line x1="4" y1="4" x2="10" y2="10" /></svg>
                            {t['maximize']}
                        </a>
                    </React.Fragment>
                )
            }
        }
    }



    render() {
        return (
            <div class="col-lg-8">
                <div class="modal modal-blur fade" id="modal-large" tabindex="-1" aria-hidden="true" style={{ display: 'none' }}>
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document" style={{ maxWidth: '95%' }}>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">
                                    {t['maximize']}

                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body p-0">
                                <div id="editor-two"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn me-auto" data-bs-dismiss="modal">{t['close']}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    {this.cardCover()}
                    <div class="card-body" id='content'>
                        {this.maximizeBtn()}
                        <div id="editor-one"></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default FlyerCard;