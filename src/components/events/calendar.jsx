import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import { Calendar } from 'react-datepicker2';
import moment from 'moment-jalaali'

const EventCalendar = (props) => {


    return (
        <Calendar
        ranges={props.highlightRanges}
        value={props.today}
        isGregorian={false}
        inputFormat="YYYY-M-D"
        inputJalaaliFormat="jYYYY-jM-jD"
        onChange={val => props.dateSelect(val)}
      />
    )
}
export default EventCalendar;
