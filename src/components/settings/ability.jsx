import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { conf } from '../../conf';
import { v4 as uuidv4 } from 'uuid';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
import moment from 'jalali-moment'
moment.locale('fa', { useGregorianParser: true });

const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;
const t = dict['fa']

const AbilityCard = (props) => {

    function profileItems(profiles) {
        var result = []
        if (profiles) {
            profiles.map((profile) => {
                result.push(
                    <div class="list-group-item" style={{ border: 'none' }}>
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <a onClick={() => props.userAbility(profile.user_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2l4 -4" /></svg>
                                </a>
                            </div>
                            <div class="col-auto">
                                <a href="#">
                                    <span class="avatar" >{profile.initials}</span>
                                </a>
                            </div>
                            <div class="col text-truncate">
                                <a href="#" class="text-body d-block">{profile.name}</a>
                                <small class="d-block text-muted text-truncate mt-n1">{profile.bio}</small>
                            </div>
                            <div class="col-auto">
                            </div>

                        </div>
                    </div>
                )
            })
        }
        return result
    }

    function abilityForm(ability) {
        console.log(ability)
        var result = []
        if (ability) {
            result.push(
                <div class="mb-3" style={{ width: '100%' }}>
                    <label class="form-label ">{t['create_event']}</label>
                    <select class="form-select" onChange={(e) => props.changeAbility('create_event', e.target.value)}>
                        <option value={true} selected={ability['create_event'] ? true : false}>{t['true']}</option>
                        <option value={false} selected={ability['create_event'] ? false : true} >{t['false']}</option>
                    </select>
                </div>
            )
            result.push(
                <div class="mb-3" style={{ width: '100%' }}>
                    <label class="form-label ">{t['create_exhibition']}</label>
                    <select class="form-select" onChange={(e) => props.changeAbility('create_exhibition', e.target.value)}>
                        <option value={true} selected={ability['create_exhibition'] ? true : false}>{t['true']}</option>
                        <option value={false} selected={ability['create_exhibition'] ? false : true} >{t['false']}</option>
                    </select>
                </div>
            )
            result.push(
                <div class="mb-3" style={{ width: '100%' }}>
                    <label class="form-label ">{t['modify_ability']}</label>
                    <select class="form-select" onChange={(e) => props.changeAbility('modify_ability', e.target.value)}>
                        <option value={true} selected={ability['modify_ability'] ? true : false}>{t['true']}</option>
                        <option value={false} selected={ability['modify_ability'] ? false : true} >{t['false']}</option>
                    </select>
                </div>
            )
            result.push(
                <div class="mb-3" style={{ width: '100%' }}>
                    <label class="form-label ">{t['administration']}</label>
                    <select class="form-select" onChange={(e) => props.changeAbility('administration', e.target.value)}>
                        <option value={true} selected={ability['administration'] ? true : false}>{t['true']}</option>
                        <option value={false} selected={ability['administration'] ? false : true} >{t['false']}</option>
                    </select>
                </div>
            )
        }
        return result
    }

    function abilityShow(ability) {
        if (ability) {
            return (
                <div className='card'>
                    <div className='card-header  bg-dark-lt'>
                        {ability.profile.name}
                    </div>
                    <div className='card-body'>
                        {abilityForm(ability)}
                    </div>
                    <div class="card-footer">
                        <div class="d-flex">
                            <button id='submit-button' onClick={() => props.submitAbility()} class="btn btn-primary ms-auto">{t['submit']}</button>
                            <div id='submit-spinner' class="spinner-border text-red ms-auto" role="status" style={{ display: 'none' }}></div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    return (
        <div className='row'>
            <div className="col-md-6">
                <div className='card'>
                    <div className='card-body'>
                        <div class="input-icon mb-3">
                            <span class="input-icon-addon">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="7" r="4"></circle><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path></svg>
                            </span>
                            <input type="text" class="form-control" placeholder={t['name']} onInput={(e) => { props.searchUser(e.target.value) }} />
                        </div>
                        {profileItems(props.profiles)}
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                {abilityShow(props.selectedAbility)}
            </div>
        </div>
    )
}
export default AbilityCard;
