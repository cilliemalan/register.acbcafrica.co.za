import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { SubmissionDetails } from './SubmissionDetails';
import { PaymentDetails } from './PaymentDetails';
import { OptionsDisplay } from './OptionsDisplay';
import { Spinner } from './Spinner';

export const RegistrationConfirmation = ({ submission, forms, onCancel, onSubmit }) => {
    const form = forms[submission.form];
    const formName = form.title;
    const total = submission.details.options.total;
    const options = form.options;
    const selection = submission.details.options;

    if (submission.complete) {
        return <Redirect to="/register/done" />
    } else if (submission.loading) {
        return <Spinner />;
    } else {
        return <div>
            <h1>Confirm Registration</h1>
            <p>You are registering for <strong>{formName}</strong>.</p>
            <SubmissionDetails submission={submission} />
            <OptionsDisplay options={options} selection={selection} />
            <div className="confirmation-buttons">
                <button type="button" onClick={onCancel}>Back</button>
                <button type="button" onClick={onSubmit}>Submit</button>
            </div>
            <div className="error">
                {submission.error}
            </div>
            {total > 0 && <PaymentDetails submission={submission} />}
        </div>;
    }

}
