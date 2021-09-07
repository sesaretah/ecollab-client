import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { v4 as uuidv4 } from 'uuid';
import moment from 'jalali-moment'
moment.locale('fa', { useGregorianParser: true });


const ExhibitionCard = (props) => {

    var  t = dict[props.lang]
    function formatGregorianDate(gregorianDate) {
        var date = new Date(gregorianDate);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var fullYear = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes;
        return fullYear;
    }


    function cardCover(exhibition) {
        if (exhibition.cover) {
            return (
                <a href={'/#/exhibitions/' + exhibition.id}>
                    <div class="card-img-top img-responsive img-responsive-16by9" style={{ backgroundImage: "url(" + exhibition.cover + ")" }}></div>
                </a>
            )
        }
    }

    function tagsShow(tags) {
        var result = []
        if (tags && tags.length > 0) {
            tags.map((tag) => {
                result.push(<span class="badge bg-lime-lt" style={{ margin: '2px' }}>{tag.title}</span>)
            })
        }
        return result
    }

    function exhibitionItems() {
        var result = []
        if (props.exhibitions) {
            props.exhibitions.map((exhibition) => {
                result.push(

                    <div className={props.col ? "col-md-" + props.col : "col-md-8"} >
                        <div className="card">
                            {cardCover(exhibition)}
                            <div className="card-body">
                                <h3 class="card-title">
                                    <a href={'/#/exhibitions/' + exhibition.id}>
                                        {exhibition.title}
                                    </a>
                                </h3>
                                <p style={{ textAlign: 'justify' }}>
                                    {exhibition.truncated_info}
                                </p>




                                <h4>{t['tags']}</h4>
                                <div class="text-muted mb-3">
                                    {tagsShow(exhibition.tags)}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return result
    }

    return (
        <React.Fragment>
            {exhibitionItems()}
        </React.Fragment>
    )
}
export default ExhibitionCard;
