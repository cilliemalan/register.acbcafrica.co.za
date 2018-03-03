import { fetchForms as apiFetchForms } from './api';

const action = (type, data = {}) => ({ type, ...data });

export const fetchingForms = () => action('FETCHING_FORMS');

export const fetchedForms = (forms) => action('FETCHED_FORMS', { forms });

export const fetchForms = () => (dispatch) => {
    dispatch(fetchingForms());
    return apiFetchForms()
        .then(forms => dispatch(fetchedForms(forms)));
}
