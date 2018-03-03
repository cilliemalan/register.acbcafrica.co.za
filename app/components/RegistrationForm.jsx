import React from 'react';
import { Link } from 'react-router-dom';
import { RegistrationFormDetails } from './RegistrationFormDetails';

export const RegistrationForm = ({ form }) =>
    <div className="form">
        <img className="headerImage" src={form.image} alt={form.title} />
        <Link to="/">&lt;&lt;&nbsp;Go&nbsp;Back</Link>
        <h1>{form.title}</h1>
        <p>You are registering for <strong>{form.title}</strong>. Please fill in the details below.</p>
        <RegistrationFormDetails form={form} />
    </div>;