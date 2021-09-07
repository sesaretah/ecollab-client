import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'jalali-moment'


const PollCard = (props) => {
    const t = dict[props.lang]
    function pollCheckBox(poll) {
        var result = []
        var i = 0
        var items = poll.answer_content
        var id = poll.id
        if (items) {
            console.log(poll.outcomes)
            items.map((item) => {
                result.push(
                    <label class="form-check">
                        <input class="form-check-input" disabled={props.disabled ? true : false} checked={poll.outcomes && poll.outcomes.length> 0 && poll.outcomes.includes(i) ? true : false } type="checkbox" value={i} onClick={(e) => props.postPolling(id, e.target.value)} />
                        <span class="form-check-label">{item} {stats(poll, i)}</span>
                    </label>
                )
                i = i + 1;
            })
        }
        return result
    }

    function pollRadioBtn(poll) {
        var result = []
        var items = poll.answer_content
        var id = poll.id
        var i = 0
        if (items) {
            items.map((item) => {
                result.push(
                    <label class="form-check">
                        <input class="form-check-input" disabled={props.disabled ? true : false} checked={poll.outcome === i ? true : false } name={'radio'+poll.id} type="radio" value={i} onClick={(e) => props.postPolling(id, e.target.value)} />
                        <span class="form-check-label">{item} {stats(poll, i)}</span>
                    </label>
                )
                i = i + 1;
            })
        }
        return result
    }

    function rated(i) {
        if (props.star >= i) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
            )
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" class="icon muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
            )
        }
    }

    function rating(poll) {
        return (
            <div>
                <a onClick={() => { props.postPolling(poll.id, 1); props.handleChange({ star: 1 }) }}>{rated(1)}</a>
                <a onClick={() => { props.postPolling(poll.id, 2); props.handleChange({ star: 2 }) }}>{rated(2)}</a>
                <a onClick={() => { props.postPolling(poll.id, 3); props.handleChange({ star: 3 }) }}>{rated(3)}</a>
                <a onClick={() => { props.postPolling(poll.id, 4); props.handleChange({ star: 4 }) }}>{rated(4)}</a>
                <a onClick={() => { props.postPolling(poll.id, 5); props.handleChange({ star: 5 }) }}>{rated(5)}</a>
                <span className='fs-11 mr-2'>()</span>
            </div>
        )
    }

    function stats(poll, val){
       // console.log(poll.stats, poll.stats[val])
        if(poll.stats){
            return '('+poll.stats[val]+')'
        }
    }

    function viewPoll() {
        var result = []
        if (props.poll) {
            var poll = props.poll
            if (poll.answer_type === 'star') {
                result.push(
                    <div class="mb-2">
                        <div class="form-label">{poll.content}</div>
                        <div>
                            {rating(poll)}
                        </div>
                    </div>
                )
            }
            if (poll.answer_type === 'single_select') {
                result.push(
                    <div class="mb-2">
                        <div class="form-label">{poll.content}</div>
                        <div>
                            {pollRadioBtn(poll)}
                        </div>
                    </div>
                )
            }
            if (poll.answer_type === 'binary') {
                result.push(
                    <div class="mb-2">
                        <div class="form-label">{poll.content}</div>
                        <div>
                            <label class="form-check">
                                <input class="form-check-input" style={{ marginTop: '4px' }} disabled={props.disabled ? true : false} checked={poll.outcome === 1 ? true : false } name={'binary-'+poll.id} type="radio" value='1' onClick={(e) => props.postPolling(poll.id, e.target.value)} />
                                <span class="form-check-label pb-1"><span class="badge bg-green-lt">{t['yes']}</span> {stats(poll, 1)}</span>
                            </label>
                            <label class="form-check">
                                <input class="form-check-input" style={{ marginTop: '4px' }} disabled={props.disabled ? true : false} checked={poll.outcome === -1 ? true : false } name={'binary-'+poll.id} type="radio" value='-1' onClick={(e) => props.postPolling(poll.id, e.target.value)} />
                                <span class="form-check-label pb-1"><span class="badge bg-red-lt">{t['no']}</span> {stats(poll, -1)}</span>
                            </label>
                        </div>
                    </div>
                )
            }
            if (poll.answer_type === 'trinary') {
                result.push(
                    <div class="mb-2">
                        <div class="form-label">{poll.content}</div>
                        <div>
                            <label class="form-check">
                                <input class="form-check-input" style={{ marginTop: '4px' }} disabled={props.disabled ? true : false} checked={poll.outcome === 1 ? true : false } name={'trinary-'+poll.id} type="radio" value='1' onClick={(e) => props.postPolling(poll.id, e.target.value)} />
                                <span class="form-check-label pb-1"><span class="badge bg-green-lt">{t['yes']}</span> {stats(poll, 1)}</span>
                            </label>
                            <label class="form-check">
                                <input class="form-check-input" style={{ marginTop: '4px' }} disabled={props.disabled ? true : false}  checked={poll.outcome === 0 ? true : false } name={'trinary-'+poll.id} type="radio" value='0' onClick={(e) => props.postPolling(poll.id, e.target.value)} />
                                <span class="form-check-label pb-1"><span class="badge bg-muted-lt">{t['abstention']}</span> {stats(poll, 0)}</span>
                            </label>
                            <label class="form-check">
                                <input class="form-check-input" style={{ marginTop: '4px' }}  disabled={props.disabled ? true : false} checked={poll.outcome === -1 ? true : false } name={'trinary-'+poll.id} type="radio" value='-1' onClick={(e) => props.postPolling(poll.id, e.target.value)} />
                                <span class="form-check-label pb-1"><span class="badge bg-red-lt">{t['no']}</span> {stats(poll, -1)}</span>
                            </label>
                        </div>
                    </div>
                )
            }
            if (poll.answer_type === 'multiple_select') {
                result.push(
                    <div class="mb-2">
                        <div class="form-label">{poll.content}</div>
                        <div>
                            {pollCheckBox(poll)}
                        </div>
                    </div>
                )
            }
        }
        return result
    }


    return (
        <React.Fragment>
            {viewPoll()}
            <div class="hr-text hr-text-left m-1 mb-2"></div>
        </React.Fragment>
    )
}
export default PollCard;
