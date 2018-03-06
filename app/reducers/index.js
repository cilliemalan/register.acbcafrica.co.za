import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

function forms(state = { items: {} }, action) {
    switch (action.type) {
        case 'FETCHING_FORMS':
            return { ...state, loading: true };
        case 'FETCHED_FORMS':
            return {
                ...state,
                items: action.forms,
                loading: false
            };
        case 'ADD_ENTRY':
            const { form, entry } = action;
            return {
                ...state,
                items: {
                    ...state.items,
                    [form]: {
                        ...state.items[form],
                        entries: [...state.items[form], entry]
                    }
                }
            };
        default:
            return state;
    }
}

function submission(state = {}, action) {
    switch (action.type) {
        case 'STAGE_REGISTRATION':
            const { form, details } = action;
            return {
                ...state,
                error: undefined,
                form,
                details
            };
        case 'SUBMITTING_REGISTRATION':
            return {
                ...state,
                error: undefined,
                loading: true
            };
        case 'SUBMITTED_REGISTRATION':
            return {
                ...state,
                error: undefined,
                loading: false
            };
        case 'CLEAR_REGISTRATION':
            return {
                ...state,
                error: undefined,
                form: undefined,
                details: undefined
            };
        case 'ERROR_REGISTRATION':
            return {
                ...state,
                loading: false,
                error: action.message,
            }
        default:
            return state;
    }
}

export default combineReducers({
    forms,
    submission,
    form: formReducer
});
