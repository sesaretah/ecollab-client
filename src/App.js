import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
  useParams,
  Link,
  Redirect,
  withRouter,
} from "react-router-dom";

import Dashboard from "./components/dashboard/index.jsx";
import UserWizard from "./components/users/wizard.jsx";
import UserLogin from "./components/users/login.jsx";

import EventIndex from "./components/events/index.jsx";
import EventShow from "./components/events/show.jsx";
import EventCreate from "./components/events/create.jsx";
import EventAttendance from "./components/events/attendance.jsx";
import EventEdit from "./components/events/create.jsx";
import EventDetail from "./components/events/detail.jsx";

import MeetingIndex from "./components/meetings/index.jsx";
import MeetingShow from "./components/meetings/show.jsx";
import MeetingCreate from "./components/meetings/create.jsx";
import MeetingAttendance from "./components/meetings/attendance.jsx";
import MeetingEdit from "./components/meetings/create.jsx";

import ExhibitionIndex from "./components/exhibitions/index.jsx";
import ExhibitionShow from "./components/exhibitions/show.jsx";
import ExhibitionCreate from "./components/exhibitions/create.jsx";
import ExhibitionEdit from "./components/exhibitions/create.jsx";

import DiscussionIndex from "./components/discussions/index.jsx";

import PollIndex from "./components/polls/index.jsx";

import CropperShow from "./components/uploads/cropper.jsx";
import UploadCreate from "./components/uploads/create.jsx";

import FlyerCreate from "./components/flyers/create.jsx";
import FlyerEdit from "./components/flyers/create.jsx";

import LoginJwt from "./components/users/loginJwt.jsx";

import QuestionCreate from "./components/questions/create.jsx";

import RoomShow from "./components/rooms/show.jsx";
import AttendanceCreate from "./components/attendances/create.jsx";

import SettingsIndex from "./components/settings/index.jsx";

import MyCalendar from "./components/common/calendar.jsx";

import ProfileIndex from "./components/profiles/index.jsx";
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();
export default class App extends React.Component {

  render() {
    return (
      <HashRouter history={history}>
        <Switch>
          <Route path="/" exact component={EventIndex} />
          <Route path="/wizard" exact component={UserWizard} />
          <Route path="/login" exact component={UserLogin} />
          <Route path="/login_jwt/:id" exact component={LoginJwt} />

          <Route path="/settings" exact component={SettingsIndex} />

          <Route path="/polls" exact component={PollIndex} />
          
          <Route path="/calendar" exact component={MyCalendar} />

          <Route path="/uploads/:id" exact component={UploadCreate} />
          <Route path="/uploads/cropper/:id" exact component={CropperShow} />

          <Route path="/events" exact component={EventIndex} />
          <Route path="/events/create" exact component={EventCreate} />
          <Route path="/events/attendance" exact component={EventAttendance} />
          <Route path="/events/:id" exact component={EventShow} />
          <Route path="/events/detail/:id" exact component={EventDetail} />
          <Route path="/events/edit/:id" exact component={EventEdit} />

          <Route path="/exhibitions" exact component={ExhibitionIndex} />
          <Route path="/exhibitions/create" exact component={ExhibitionCreate} />
          <Route path="/exhibitions/:id" exact component={ExhibitionShow} />
          <Route path="/exhibitions/edit/:id" exact component={ExhibitionEdit} />


          <Route path="/meetings" exact component={MeetingIndex} />
          <Route path="/meetings/create" exact component={MeetingCreate} />
          <Route
            path="/meetings/attendance"
            exact
            component={MeetingAttendance}
          />
          <Route path="/meetings/:id" exact component={MeetingShow} />
          <Route path="/meetings/edit/:id" exact component={MeetingEdit} />

          <Route path="/flyers/create" exact component={FlyerCreate} />
          <Route path="/flyers/edit/:id" exact component={FlyerEdit} />

          <Route path="/questions/create" exact component={QuestionCreate} />

          <Route
            path="/attendances/create"
            exact
            component={AttendanceCreate}
          />

          <Route path="/rooms/:id" exact component={RoomShow} />

          <Route path="/discussions" exact component={DiscussionIndex} />

          <Route path="/profiles" exact component={ProfileIndex} />
        </Switch>
      </HashRouter>
    );
  }
}
