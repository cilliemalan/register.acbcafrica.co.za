import React from 'react';
import { PersonalDetails } from './PersonalDetails';
import { ConferenceItemDetails } from './ConferenceItemDetails';

export const RegistrationFormDetails = ({ form }) =>
    <form>
        <PersonalDetails />
        <ConferenceItemDetails options={form.options} />
    </form>;