import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { Calendar } from 'react-datepicker2';
import moment from 'moment-jalaali'


const Validation = (props) => {
    const t = dict[props.lang]
    function items() {
        var result = []
        if (props.items) {
            props.items.map((item) => {
                result.push(<li>{t[item]}</li>)
            })
        }
        return result
    }
    return (
        <React.Fragment>
            <a href="#" ref={props.modal} class="btn btn-white" data-bs-toggle="modal" data-bs-target="#modal-danger" style={{ display: "none" }}>
                Danger modal
            </a>
            <div class="modal modal-blur fade" id="modal-danger" tabindex="-1" style={{ display: "none" }} aria-hidden="true">
                <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div class="modal-status bg-danger"></div>
                        <div class="modal-body text-center py-2">

                            <svg xmlns="http://www.w3.org/2000/svg" class="icon mb-2 text-danger icon-lg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 9v2m0 4v.01"></path><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path></svg>
                            <h3>{t['error']}</h3>
                            <div class="text-muted">
                                {t['the_following_should_not_be_empty']}
                            </div>

                        </div>
                        <div >
                            <ul class="list-unstyled px-4">
                                {items()}
                            </ul>
                        </div>

                        <div class="modal-footer">
                            <div class="w-100">
                                <div class="row">
                                    <div class="col"><a href="#" class="btn btn-white w-100" data-bs-dismiss="modal">
                                        {t['cancel']}
                                    </a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>

    )
}
export default Validation;
