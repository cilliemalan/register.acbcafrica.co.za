import React from 'react';
import { Link } from 'react-router-dom';
import { SubmissionDetails } from './SubmissionDetails';
import { PaymentDetails } from './PaymentDetails';

export const RegistrationConfirmation = ({ submission, forms }) => {
    const formName = forms[submission.form].title;
    const total = submission.details.options.total;
    return <div>
        <h1>Confirm Registration</h1>
        <p>You are registering for <strong>{formName}</strong>.</p>
        <SubmissionDetails submission={submission} />
        { total > 0 && <PaymentDetails submission={submission} /> }
    </div>;
}