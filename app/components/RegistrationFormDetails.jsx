import React from 'react';
import { PersonalDetails } from './PersonalDetails';
import { ConferenceItemDetails } from './ConferenceItemDetails';
import { reduxForm, Field } from 'redux-form'

let RegistrationFormDetails = ({ fillingForm }) =>
    <form>
        <PersonalDetails />
        <Field component={ConferenceItemDetails} name="options" options={fillingForm.options} />
    </form>;

RegistrationFormDetails = reduxForm({
    form: 'personalDetails'
})(RegistrationFormDetails);

export { RegistrationFormDetails };