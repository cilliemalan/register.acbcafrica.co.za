import React from 'react';
import { Field, reduxForm } from 'redux-form';

const required = value =>
    value && /[a-zA-Z]{3,}/.test(value)
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

const renderField = ({ input, label, type, required, meta: { touched, error, warning } }) =>
    <div className={"form-group " + (required && "required ") + (touched && error && "error ")}>
        <label htmlFor="firstname">{label}</label>
        <input {...input} type={type} />
        <div className="error">
            {touched && error}
        </div>
    </div>;

const PersonalDetails = (props) =>
    <div>
        <h2>Personal Information</h2>
        <p>Please the personal information for the registrant.</p>

        <Field component={renderField} label="Title" type="text" id="title" required autoComplete="honorific-prefix" validate={required} name="title" />
        <Field component={renderField} label="First Name" type="text" id="firstname" required autoComplete="given-name" validate={required} name="firstname" />
        <Field component={renderField} label="Surname" type="text" id="lastname" required autoComplete="family-name" validate={required} name="lastname" />
        <Field component={renderField} label="Contact Number" type="text" id="contactNumber" required autoComplete="tel" validate={telephone} name="contactNumber" />
        <Field component={renderField} label="Email" type="email" id="email" required autoComplete="email" validate={email} name="email" />
        <Field component={renderField} label="Which country are you from?" type="text" id="country" required autoComplete="country-name" validate={required} name="country" />
        <Field component={renderField} label="Which church are you from?" type="text" id="church" name="church" />
    </div>;

export { PersonalDetails };