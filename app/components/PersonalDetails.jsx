import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import _ from 'lodash';
import moment from 'moment';
import { ChildcareSection } from './ChildcareSection';

const required = value =>
    value && /[a-zA-Z]{2,}/.test(value)
        ? undefined
        : 'Required';
const email = value =>
    value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? undefined
        : 'Please enter a valid email address';
const telephone = value =>
    value && /^\+(?:[- ()\[\]]*[0-9]){11,15}$|^(?:[- ()\[\]]*[0-9]){10}$/i.test(value)
        ? undefined
        : 'Please enter a valid telephone number'

const renderField = ({ id, input, label, type, required, meta: { touched, error, warning } }) =>
    <div className={"form-group " + (required && "required ") + (touched && error && "error ")}>
        <label htmlFor={id}>{label}</label>
        <input {...input} id={id} type={type} />
        <div className="error">
            {touched && error}
        </div>
    </div>;

const renderCheckbox = ({ id, input, label, type }) =>
    <div>
        <input type={type}
            className="css-checkbox"
            id={id}
            {...input} />
        <label className="css-label" htmlFor={id}>{label}</label>
    </div>;

let PersonalDetails = ({ needsChildcare, fillingForm: { childcare } }) => {
    const hasChildcare = childcare && childcare.days && !!childcare.days.length;
    const childcareTitle = childcare && childcare.title;
    const childcareSubtitle = childcare && childcare.subtitle;
    const minAge = childcare && childcare.minAge;
    const maxAge = childcare && childcare.maxAge;

    const days = childcare.days || [];
    const slots = _(days)
        .flatMap(day => day.slots)
        .uniq()
        .orderBy(x => x)
        .value();
    const dates = days.map(({ date }) => date);
    const dateDays = days.map(({ date }) => moment(date).format('ddd'));
    const daysByDate = {};
    days.forEach(day => daysByDate[day.date] = day.slots);

    return <div>
        <h2>Personal Information</h2>
        <p>Please the personal information for the registrant.</p>

        <Field component={renderField} label="Title" type="text" id="title" required autoComplete="honorific-prefix" validate={required} name="title" />
        <Field component={renderField} label="First Name" type="text" id="firstname" required autoComplete="given-name" validate={required} name="firstname" />
        <Field component={renderField} label="Surname" type="text" id="lastname" required autoComplete="family-name" validate={required} name="lastname" />
        <Field component={renderField} label="Contact Number" type="text" id="contactNumber" required autoComplete="tel" validate={telephone} name="contactNumber" />
        <Field component={renderField} label="Email" type="email" id="email" required autoComplete="email" validate={email} name="email" />
        <Field component={renderField} label="Which country are you from?" type="text" id="country" required autoComplete="country-name" validate={required} name="country" />
        <Field component={renderField} label="Which church are you from?" type="text" id="church" name="church" />
        {hasChildcare
            ? <div>
                <h2 htmlFor="childcare">{childcareTitle}</h2>
                <p>{childcareSubtitle}</p>
                <Field component={renderCheckbox} label="I Require Childcare" type="checkbox" id="childcare" name="childcare" />
                {needsChildcare
                    ? <ChildcareSection dates={dates}
                        daysByDate={daysByDate}
                        slots={slots}
                        minAge={minAge}
                        maxAge={maxAge} />
                    : undefined}
            </div>
            : undefined}
    </div>;
}

const selector = formValueSelector('personalDetails');
PersonalDetails = connect(state => {
    return {
        ...state,
        needsChildcare: selector(state, 'childcare')
    };
})(PersonalDetails);

export { PersonalDetails };
