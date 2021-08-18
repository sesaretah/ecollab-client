import React from 'react'
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import $ from 'jquery';
import { dict } from '../../Dict';
import { conf } from '../../conf';
import Header from "../header/header.jsx";
import EventCard from "./card.jsx";
import moment from 'moment-jalaali'
import DatePicker2 from 'react-datepicker2';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
const AsyncTypeahead = withAsync(Typeahead);
const server = conf.server;

const t = dict['fa']

export default class EventIndex extends React.Component {

    constructor(props) {
        super(props);
        this.getList = this.getList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.attend = this.attend.bind(this);
        this.setInstance = this.setInstance.bind(this);
        


        this.state = {
            token: window.localStorage.getItem('token'),
            title: null,
            events: null,
            allTags: null,
            q: '',
            start_from: moment(),
            start_to: moment().add(2, 'jMonth'),
            tags: [],
            page: 1,
        }

    }


    componentWillMount() {
        ModelStore.on("got_list", this.getList);
        ModelStore.on("set_instance", this.setInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_list", this.getList);
        ModelStore.removeListener("set_instance", this.setInstance);
    }

    componentDidMount() {
        MyActions.getList('events', this.state.page, {}, this.state.token);
        MyActions.getList('tags/top', this.state.page, {}, this.state.token);
    }

    getList() {
        var list = ModelStore.getList()
        var klass = ModelStore.getKlass()

        if (list && klass === 'Event') {
            $('#search-spinner').hide();
            if (list[0] && list[0].page) {
                if (list[0].page == 1) {
                    this.setState({
                        events: list,
                    });
                } else {
                    this.setState({
                        events: this.state.events.concat(list),
                    });
                }
                this.setState({ page: list[0].page })
            } else {
                this.setState({
                    events: [],
                });
            }
            console.log(list)
        }
        if (list && klass === 'Tag') {
            this.setState({
                allTags: list,
            });
        }
    }

    setInstance() {
        var klass = ModelStore.getKlass()
        var model = ModelStore.getIntance()
        if (model && klass === 'Event') {
            var self = this;
            var events = self.state.events;
            if (events.length > 0) {
              for (let i = 0; i < events.length; i++) {
                if (events[i].id == model.id) {
                  let newState = Object.assign({}, self.state);
                  newState.events[i] = model;
                  self.setState(newState, () => console.log(self.state.events));
                }
              }
            }
            console.log(model)
        }
    }



    handleChange(obj) {
        this.setState(obj);
    }


    noEventCard() {
        <div class="col-12">
            <div class="card">
                <div class="empty">
                    <div class="empty-img"><img src="./static/illustrations/undraw_quitting_time_dm8t.svg" height="128" alt="" />
                    </div>
                    <p class="empty-title">No results found</p>
                    <p class="empty-subtitle text-muted">
                        Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <div class="empty-action">
                        <a href="/#/events/create" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="10" y1="16" x2="14" y2="16" /><line x1="12" y1="14" x2="12" y2="18" /></svg>
                            Create an event
                        </a>
                    </div>
                </div>
            </div>
        </div>
    }

    checkEvent() {
        if (this.state.events) {
            return (
                <React.Fragment>
                    <div class="col-4">
                        <div class="card">
                            <div class="card-status-top bg-lime"></div>
                            <div className="card-header" >
                                <h3 class="card-title">{t['events']}</h3>
                                <ul class="nav nav-pills card-header-pills">
                                    <li class="nav-item ms-auto">
                                        <a class="nav-link p-1" href={"/#/events/create"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="card-body">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem
                                </p>
                            </div>
                        </div>
                    </div>
                    <EventCard events={this.state.events} col={8} />
                </React.Fragment>
            )
        } else {
            return (this.noEventCard())
        }
    }

    cardMasonry() {
        if (this.state.events) {
            return (
                <div class='row row-cards' data-masonry='{"percentPosition": true }' >
                    <EventCard events={this.state.events} col={6} attend={this.attend}/>
                </div>
            )
        }
    }

    attend(flag, attendable_id) {
        var data = { attendable_id: attendable_id, attendable_type: 'Event', flag: flag }
        MyActions.setInstance('attendances/attend', data, this.state.token)
    }

    search() {
        $('#search-spinner').show();
        var data = { q: this.state.q, start_from: this.state.start_from, start_to: this.state.start_to, tags: this.state.tags }
        MyActions.getList('events/search', this.state.page, data, this.state.token);
        this.setState({ page: 1 })
    }

    tagCheckbox() {
        var result = []
        if (this.state.allTags) {
            this.state.allTags.map((tag) => {
                result.push(
                    <label class="form-check">
                        <input id={'tag-check-' + tag.id} class="form-check-input" type="checkbox" style={{ marginTop: '3.5px' }} value={tag.id} onChange={(e) => this.changeTags(e)} />
                        <span class="form-check-label">
                            <span class="badge bg-lime-lt" style={{ margin: '2px' }}>{tag.title}</span>
                        </span>
                    </label>
                )
            })
        }
        return result
    }

    tagSelected(tags) {
        var result = []
        tags.map((tag) => {
            if (tag['title']) {
                result.push(tag['title'])
            } else {
                result.push(tag)
            }
        })
        this.setState({ tags: result }, () => console.log(this.state.tags))
    }

    tagInput() {
        return (
            <div style={{ direction: 'ltr', marginBottom: '70px' }}>
                <AsyncTypeahead
                    id='search-tag'
                    multiple
                    defaultSelected={this.state.tags}
                    isLoading={this.state.isLoading}
                    labelKey='title'
                    onSearch={(query) => {
                        this.setState({ isLoading: true });
                        fetch(server + "/tags/search?q=" + query)
                            .then((resp) => resp.json())
                            .then(({ items }) => {
                                this.setState({ options: items, isLoading: false }, () => console.log(this.state.options))
                            });
                    }}
                    onChange={(t) => this.tagSelected(t)}
                    options={this.state.options}
                    renderMenuItemChildren={(option, props) => (
                        <React.Fragment>
                            <span>{option.title}</span>
                        </React.Fragment>
                    )}
                />
            </div>
        )
    }


    loadMore() {
        var data = { id: this.state.id, page: this.state.page + 1, q: this.state.q, start_from: this.state.start_from, start_to: this.state.start_to, tags: this.state.tags }
        MyActions.getList('events/search', this.state.page, data, this.state.token);
    }


    render() {

        return (
            <body className="antialiased">
                <div className="wrapper">
                    <Header history={this.props.history} />
                    <div className="page-wrapper">
                        <div className="container-xl">
                            <div className="page-header d-print-none">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="page-pretitle">{t['overview']}</div>
                                        <h2 className="page-title">{t['events']}</h2>
                                    </div>
                                    <div class="col-auto ms-auto d-print-none">
                                        <div class="btn-list">
                                            <a href={"/#/events/create"} class="btn btn-primary"  >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                {t['create_event']}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page-body">
                            <div className="container-xl">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="card mb-3">
                                            <div className="card-header" >
                                                <h4 class="card-title">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" /></svg>
                                                    {t['filter_events']}
                                                </h4>
                                            </div>

                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">{t['contains_words']}</label>
                                                    <div class="input-icon mb-3">
                                                        <input type="text" class="form-control" placeholder={t['search_placeholder']} onInput={(e) => { this.handleChange({ q: e.target.value }) }} />
                                                        <span class="input-icon-addon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="mb-3" style={{ width: '100%' }}>
                                                    <label class="form-label ">{t['date_from']}<span class="form-label-description"></span></label>
                                                    <DatePicker2
                                                        isGregorian={false}
                                                        onChange={value => { this.setState({ start_from: value }) }}
                                                        value={moment(this.state.start_from)}
                                                    />
                                                    <label class="form-label mt-2">{t['date_to']}<span class="form-label-description"></span></label>
                                                    <DatePicker2
                                                        isGregorian={false}
                                                        onChange={value => { this.setState({ start_to: value }) }}
                                                        value={moment(this.state.start_to)}
                                                    />
                                                </div>

                                                <div class="mb-3 " id='tags' >
                                                    <label class="form-label" >{t['tags']}</label>
                                                    {this.tagInput()}
                                                </div>
                                            </div>
                                            <div class="card-body">

                                                <a onClick={() => this.search()} class="btn btn-primary w-100">
                                                    <span style={{ verticalAlign: '-2px' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" /></svg>
                                                    </span>
                                                    {t['filter_and_search']}
                                                    <div id='search-spinner' class="spinner-border text-red" role="status" style={{ display: 'none' }}></div>
                                                </a>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="col-lg-9">
                                        {this.cardMasonry()}
                                        <div class="hr-text">
                                            <a onClick={() => this.loadMore()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="9" /><line x1="8" y1="12" x2="12" y2="16" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="16" y1="12" x2="12" y2="16" /></svg>
                                                {t['more']}
                                            </a>
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




