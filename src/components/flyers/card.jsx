import React, { Component } from 'react';
import { render } from 'react-dom';
import { dict } from '../../Dict';
import { conf } from "../../conf";
import Quill from 'quill';

class FlyerCard extends Component {
    constructor(props) {
        super(props);


        this.state = {
            quillOne: null,
            cover: null,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.quill_content !== this.props.quill_content) {
            //console.log('*****', this.props.quill_content)
            // if(this.state.quillOne){
            this.state.quillOne.setContents(this.props.quill_content)
            // }

        }
        if (prevProps.cover !== this.props.cover) {
            this.setState({ cover: this.props.cover })
        }
    }

    componentWillUnmount() {

    }




    componentDidMount() {
        var quillOne = new Quill('#editor-one', {
            readOnly: true,
        });
        this.setState({ quillOne: quillOne })
    }

    cardCover() {
        if (this.state.cover) {
            return (<div class="card-img-top img-responsive img-responsive-16by9" style={{ backgroundImage: "url(" + this.state.cover + ")" }}></div>)
        }
    }



    render() {
        return (

            <div class="col-lg-8">
                <div class="card">
                    {this.cardCover()}
                    <div class="card-body" id='content'>
                        <div id="editor-one"></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default FlyerCard;