import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const SubmissionDetails = ({ submission, forms }) => {
    const { details: { title, firstname, lastname, contactNumber, email, country, church } } = submission;
    return <div>
        <h2>Personal Information</h2>
        <p>
            Name: <strong>{title} {firstname} {lastname}</strong><br />
            Contact number: <strong>{contactNumber}</strong><br />
            Email: <strong>{email}</strong><br />
            Country: <strong>{country}</strong><br />
            {church && <Fragment>Church: <strong>{church}</strong><br /></Fragment>}
        </p>
    </div>;
}