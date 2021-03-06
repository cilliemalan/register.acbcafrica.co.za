import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { SubmissionDetails } from './SubmissionDetails';
import { PaymentDetails } from './PaymentDetails';
import { OptionsDisplay } from './OptionsDisplay';
import { Spinner } from './Spinner';
import { ConferenceDetails } from './ConferenceDetails';

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
            <h1 className="make-them-see">You're almost done!</h1>
            <ConferenceDetails form={form} message="Please confirm your registration." />
            <SubmissionDetails submission={submission} form={form} />
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
