import { 
    fetchForms as apiFetchForms,
    submitRegistration as apiSubmitRegistration
 } from './api';

const action = (type, data = {}) => ({ type, ...data });

export const fetchingForms = () => action('FETCHING_FORMS');

export const fetchedForms = (forms) => action('FETCHED_FORMS', { forms });

export const fetchForms = () => (dispatch) => {
    dispatch(fetchingForms());
    return apiFetchForms()
        .then(forms => dispatch(fetchedForms(forms)));
}

export const fetchFormsIfNeeded = () => (dispatch, getState) => {
    const { forms } = getState();

    if (!Object.keys(forms.items).length) {
        dispatch(fetchForms());
    }
}

export const stageRegistration = (form, details) => action('STAGE_REGISTRATION', { form, details });

export const submittingRegistration = () => action('SUBMITTING_REGISTRATION');

export const submittedRegistration = () => action('SUBMITTED_REGISTRATION');

export const errorRegistration = (message) => action('ERROR_REGISTRATION', { message });

export const submitRegistration = (form, details) => (dispatch, getState) => {
    dispatch(submittingRegistration());
    return apiSubmitRegistration({ form, details })
        .then(() => dispatch(submittedRegistration()))
        .catch(message => dispatch(errorRegistration(message)))
}

export const clearRegistration = () => action('CLEAR_REGISTRATION');