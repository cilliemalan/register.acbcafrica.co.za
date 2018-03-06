import React from 'react';
import { Link } from 'react-router-dom';
import { SubmissionDetails } from './SubmissionDetails';
import { PaymentDetails } from './PaymentDetails';
import { OptionsDisplay } from './OptionsDisplay';

export const RegistrationConfirmation = ({ submission, forms }) => {
    const form = forms[submission.form];
    const formName = form.title;
    const total = submission.details.options.total;
    const options = form.options;
    const selection = submission.details.options;

    return <div>
        <h1>Confirm Registration</h1>
        <p>You are registering for <strong>{formName}</strong>.</p>
        <SubmissionDetails submission={submission} />
        <OptionsDisplay options={options} selection={selection} />
    </div>;
}