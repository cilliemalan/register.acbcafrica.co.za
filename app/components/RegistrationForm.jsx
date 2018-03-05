import React from 'react';
import { PersonalDetails } from './PersonalDetails';
import { OptionsEditor } from './OptionsEditor';
import { reduxForm, Field } from 'redux-form'

const validateConferenceOptions = (value = {}, _, { fillingForm: { options } }) => {
    const requiredOptions = Object.keys(options)
        .filter(key => options[key].required);
    if (requiredOptions.length) {
        const selectedRequiredOptions = requiredOptions.filter(key => value[key]);
        if (!selectedRequiredOptions.length) {
            const requiredOptionsTitles = requiredOptions.map(key => options[key].title)
                .join(", ");

            if (requiredOptions.length == 1) {
                return `${requiredOptionsTitles} is required to be selected.`;
            } else {
                return `Please select at least one of: ${requiredOptionsTitles}.`;
            }
        }
    }
}

let RegistrationForm = ({ fillingForm, handleSubmit }) => {

    return <form onSubmit={handleSubmit}>
        <PersonalDetails />
        <Field component={OptionsEditor} name="options" validate={validateConferenceOptions} options={fillingForm.options} />
        <div className="form-group submit">
            <button>Submit</button>
        </div>
    </form>;
}

RegistrationForm = reduxForm({
    form: 'personalDetails',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(RegistrationForm);

export { RegistrationForm };