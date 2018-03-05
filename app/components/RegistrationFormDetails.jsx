import React from 'react';
import { PersonalDetails } from './PersonalDetails';
import { ConferenceItemDetails } from './ConferenceItemDetails';
import { reduxForm, Field } from 'redux-form'



let RegistrationFormDetails = ({ fillingForm, handleSubmit }) => {

    const validateConferenceOptions = (value = {}) => {
        const requiredOptions = Object.keys(fillingForm.options)
            .filter(key => fillingForm.options[key].required);
        if (requiredOptions.length) {
            const selectedRequiredOptions = requiredOptions.filter(key => value[key]);
            if (!selectedRequiredOptions.length) {
                const requiredOptionsTitles = requiredOptions.map(key => fillingForm.options[key].title)
                    .join(", ");
        
                return `Please select at least one of: ${requiredOptionsTitles}`;
            }
        }
    }

    return <form onSubmit={handleSubmit}>
        <PersonalDetails />
        <Field component={ConferenceItemDetails} name="options" validate={validateConferenceOptions} options={fillingForm.options} />
        <div className="form-group submit">
            <button>Submit</button>
        </div>
    </form>;
}

RegistrationFormDetails = reduxForm({
    form: 'personalDetails'
})(RegistrationFormDetails);

export { RegistrationFormDetails };