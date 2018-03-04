import React from 'react';
import { Link } from 'react-router-dom';
import { RegistrationFormDetails } from './RegistrationFormDetails';

export const RegistrationForm = ({ fillingForm }) => {
    const submit = (calues) => {
        console.log(calues);
    }

    return <div className="form">
        <img className="headerImage" src={fillingForm.image} alt={fillingForm.title} />
        <Link to="/">&lt;&lt;&nbsp;Go&nbsp;Back</Link>
        <h1>{fillingForm.title}</h1>
        <p>You are registering for <strong>{fillingForm.title}</strong>. Please fill in the details below.</p>
        <RegistrationFormDetails fillingForm={fillingForm} onSubmit={submit} />
    </div>;
}
