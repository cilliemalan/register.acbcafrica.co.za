import React from 'react';
import { PersonalDetails } from './PersonalDetails';
import { ConferenceItemDetails } from './ConferenceItemDetails';
import { reduxForm, Field } from 'redux-form'



let RegistrationFormDetails = ({ fillingForm, handleSubmit }) =>
    <form onSubmit={handleSubmit}>
        <PersonalDetails />
        <Field component={ConferenceItemDetails} name="options" options={fillingForm.options} />
        <div className="form-group submit">
            <button>Submit</button>
        </div>
    </form>;

RegistrationFormDetails = reduxForm({
    form: 'personalDetails'
})(RegistrationFormDetails);

export { RegistrationFormDetails };