import logo from "./logo.svg";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
  useParams,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";


import Dashboard from "./components/dashboard/index.jsx";
import UserWizard from "./components/users/wizard.jsx";

import EventIndex from "./components/events/index.jsx";
import EventShow from "./components/events/show.jsx";
import EventCreate from "./components/events/create.jsx";
import EventAttendance from "./components/events/attendance.jsx";
import EventEdit from "./components/events/create.jsx";

import MeetingIndex from "./components/meetings/index.jsx";
import MeetingShow from "./components/meetings/show.jsx";
import MeetingCreate from "./components/meetings/create.jsx";
import MeetingAttendance from "./components/meetings/attendance.jsx";
import MeetingEdit from "./components/meetings/create.jsx";

import DiscussionIndex from "./components/discussions/index.jsx";

import FlyerCreate from "./components/flyers/create.jsx";
import FlyerEdit from "./components/flyers/create.jsx";

import RoomShow from "./components/rooms/show.jsx";
import AttendanceCreate from "./components/attendances/create.jsx";

import ProfileIndex from "./components/profiles/index.jsx";

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/wizard" exact component={UserWizard} />

        <Route path="/events" exact component={EventIndex} />
        <Route path="/events/create" exact component={EventCreate} />
        <Route path="/events/attendance" exact component={EventAttendance} />
        <Route path="/events/:id" exact component={EventShow} />
        <Route path="/events/edit/:id" exact component={EventEdit} />


        <Route path="/meetings" exact component={MeetingIndex} />
        <Route path="/meetings/create" exact component={MeetingCreate} />
        <Route path="/meetings/attendance" exact component={MeetingAttendance} />
        <Route path="/meetings/:id" exact component={MeetingShow} />
        <Route path="/meetings/edit/:id" exact component={MeetingEdit} />

        <Route path="/flyers/create" exact component={FlyerCreate} />
        <Route path="/flyers/edit/:id" exact component={FlyerEdit} />

        <Route path="/attendances/create" exact component={AttendanceCreate} />

        <Route path="/rooms/:id" exact component={RoomShow} />

        <Route path="/discussions" exact component={DiscussionIndex} />

        <Route path="/profiles" exact component={ProfileIndex} />

      </Switch>
    </HashRouter>
  );
}

export default App;
