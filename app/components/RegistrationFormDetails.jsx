import React from 'react';
import { PersonalDetails } from './PersonalDetails';
import { ConferenceItemDetails } from './ConferenceItemDetails';
import { reduxForm } from 'redux-form'

let RegistrationFormDetails = ({ fillingForm }) =>
    <form>
        <PersonalDetails />
        <ConferenceItemDetails options={fillingForm.options} />
    </form>;

RegistrationFormDetails = reduxForm({
    form: 'personalDetails'
})(RegistrationFormDetails);

export { RegistrationFormDetails };