import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";


const QuestionCard = (props) => {
    const t = dict[props.lang]
    function questions() {
        var result = []
        if (props.questions) {
            props.questions.map((question) => {
                if (question.content) {
                    result.push(
                        <div class="list-group-item">
                            <div class="row align-items-center">
                                <div class="col text-truncate">
                                    <a onClick="" class="text-body d-block">{question.content}</a>
                                </div>
                            </div>
                        </div>)
                }
            });
        }

        return result
    }

    function createBtn() {
        if (props.is_admin) {
            return (
                <li class="nav-item ms-auto">
                    <a class="nav-link p-1" href={"/#/questions/create?" + props.questionable_type + "_id=" + props.questionable_id}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </a>
                </li>
            )
        }
    }

    return (

        <div className="card mb-3" style={props.height ? { height: props.height } : { height: 'auto' }}>
            <div className="card-header" >
                <h3 class="card-title">{t['q_and_a_s']}</h3>
                <ul class="nav nav-pills card-header-pills">
                    {createBtn()}
                </ul>
            </div>
            <div class="list-group list-group-flush list-group-hoverable">
                {questions()}
            </div>
        </div>

    )
}
export default QuestionCard;