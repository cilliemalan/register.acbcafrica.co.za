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

export default combineReducers({ forms, form: formReducer });
