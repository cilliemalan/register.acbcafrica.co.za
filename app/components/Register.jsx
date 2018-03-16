import React from 'react';
import { Link } from 'react-router-dom';
import { RegistrationForm } from './RegistrationForm';
import { ConferenceDetails } from './ConferenceDetails';

export const Register = ({ fillingForm, onSubmit }) => {

    return <div className="form">
        <img className="headerImage" src={fillingForm.image} alt={fillingForm.title} />
        <Link to="/">&lt;&lt;&nbsp;Go&nbsp;Back</Link>
        <h1>{fillingForm.title}</h1>
        <ConferenceDetails form={fillingForm} message="Please fill in the details below." />
        <RegistrationForm fillingForm={fillingForm} onSubmit={onSubmit} />
    </div>;
}
