import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ChildcareDetails = ({ children, childcare }) => {

    const days = childcare && childcare.days || [];
    const slots = _(days)
        .flatMap(day => day.slots)
        .uniq()
        .orderBy(x => x)
        .value();
    const dates = days.map(({ date }) => date);
    const dateDays = days.map(({ date }) => moment(date).format('ddd'));
    const daysByDate = {};
    days.forEach(day => daysByDate[day.date] = day.slots);

    const slotsDisplay = (selectedDays) => {

        return selectedDays.map((selectedSlots, d_ix) => {
            const dayDetails = dateDays[d_ix];
            const slotDisplay = selectedSlots
                .map((yes, s_ix) => yes && slots[s_ix])
                .filter(x => x)
                .map((text, ix) => <Fragment>
                    {ix != 0 && " and "}
                    <strong>{text}</strong>
                </Fragment>)
            return slotDisplay.length && <Fragment>
                <strong>{dayDetails}</strong>&nbsp;
                {slotDisplay}
            </Fragment>;
        })
        .filter(x => x)
        .map((stuff, ix) => <Fragment>{ix != 0 && ", "}{stuff}</Fragment>)
    }
    return <Fragment>
        Children: <br />
        {children.map(({ name, age, days }) =>
            <div className="child-summary">
                <strong>{name}</strong> (<strong>{age}</strong> years old) for {slotsDisplay(days)}<br />
            </div>)}
    </Fragment>
}

export const SubmissionDetails = ({ submission, form }) => {
    const { details: { title,
        firstname, lastname, contactNumber,
        email, country, church,
        childcare, children } } = submission;

    const hasChildcare = !!form.childcare;


    return <div>
        <h2>Personal Information</h2>
        <p>
            Name: <strong>{title} {firstname} {lastname}</strong><br />
            Contact number: <strong>{contactNumber}</strong><br />
            Email: <strong>{email}</strong><br />
            Country: <strong>{country}</strong><br />
            {church && <Fragment>Church: <strong>{church}</strong><br /></Fragment>}
            {hasChildcare && <Fragment>Childcare: <strong>{childcare ? "Yes" : "No"}</strong><br /></Fragment>}
            {hasChildcare && childcare && <ChildcareDetails children={children} childcare={form.childcare} />}
        </p>
    </div>;
}