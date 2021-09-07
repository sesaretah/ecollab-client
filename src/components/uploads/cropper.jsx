import React from 'react'
import ReactDOM from 'react-dom'
import Slider from '@material-ui/core/Slider'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import Cropper from 'react-easy-crop'
import RangeSlider from 'react-bootstrap-range-slider';
import { dict } from '../../Dict';
var t = dict['farsi']

export default class CropperShow extends React.Component {
    constructor(props) {
        super(props);
        this.getInstance = this.getInstance.bind(this);
        this.setInstance = this.setInstance.bind(this);
        this.showCropper = this.showCropper.bind(this);

        this.state = {
            lang: window.localStorage.getItem('lang'),
            dir: window.localStorage.getItem('dir'),
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 16 / 5,
            uploadable_type: null,
            uploadable_id: null,
            id: null,
            imageSrc: null,
            crop_settings: null,
            uploadable_link: null,
        }

    }

    componentWillMount() {
        ModelStore.on("got_instance", this.getInstance);
        ModelStore.on("set_instance", this.setInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_instance", this.getInstance);
        ModelStore.removeListener("set_instance", this.setInstance);
    }

    componentDidMount() {
        t = dict[this.state.lang]
        MyActions.getInstance('uploads', this.props.match.params.id, this.state.token);
    }

    getInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'UploadShow') {
            this.setState({
                id: model.id,
                crop_settings: model.crop,
                uploadable_type: model.uploadable_type,
                uploadable_id: model.uploadable_id,
                imageSrc: model.link,
                uploadable_link: model.uploadable_link
            }, () => {
               
            })
        }
        console.log(model.cropped)
        
    }

    onCropChange = (crop) => {
        this.setState({ crop })
    }

    onCropComplete = (croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
        this.setState({ crop_settings: croppedAreaPixels })
        
    }

    onZoomChange = (zoom) => {
        this.setState({ zoom })
    }

    submit() {
        MyActions.updateInstance('uploads', {id: this.state.id, crop_settings: this.state.crop_settings}, this.state.token);
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (klass === 'Upload') {
            this.props.history.push('/'+ this.state.uploadable_link)
        }
    }

    showCropper() {
        if(this.state.imageSrc){
            console.log(this.state.imageSrc)
            return(
                <Cropper
                image={this.state.imageSrc}
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={this.state.aspect}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
            />
            )
        }
    }

    render() {
        return (
            <div className="App">
                <div className="crop-container">
                    {this.showCropper()}
                </div>
                <div className="controls">
                    <RangeSlider
                        value={this.state.zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoom) => this.onZoomChange(zoom)}
                        classes={{ container: 'slider' }}
                    />


                </div>
                <div className="crop-save">
                    <a onClick={() => this.submit()} class="btn btn-primary">
                        {t['save']}
                    </a>
                </div>
            </div>
        )
    }
}


