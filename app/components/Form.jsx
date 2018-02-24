import React from 'react';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom';
import forms from '../forms';
import { user } from '../auth';
import { Login } from './Login';
import { PersonalDetails } from './PersonalDetails';
import { ConferenceItemDetails } from './ConferenceItemDetails';
import facebook_logo from '../content/facebook-logo.png';
import google_logo from '../content/google-logo.png';
import padlock_image from '../content/padlock.png';

export class Form extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const props = this.props;
        const thisFormName = props.match.params.id;
        this.setState({ form: forms[thisFormName] });
    }

    render() {
        const form = this.state.form;
        if (!form) {
            return <div className="form"></div>
        } else {
            return <div className="form">
                <img className="headerImage" src={form.image} alt={form.title} />
                <Link to="/">&lt;&lt;&nbsp;Go&nbsp;Back</Link>
                <h1>{form.title}</h1>
                <p>You are registering for <strong>{form.title}</strong>. Please fill in the details below.</p>
                <form>
                    <PersonalDetails />
                    <ConferenceItemDetails options={form.options} />
                </form>
            </div>;
        }
    }
}