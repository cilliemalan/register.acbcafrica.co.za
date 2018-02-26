import formsUrl from '../content/forms.json';

const action = (type, data = {}) => ({ type, ...data });

export const fetchingForms = () => action('FETCHING_FORMS');

export const fetchedForms = (forms) => action('FETCHED_FORMS', { forms });

export const fetchForms = () => (dispatch) => {
    dispatch(fetchingForms());
    return fetch(formsUrl)
        .then(response => response.json())
        .then(forms => dispatch(receiveForms(forms)));
}
