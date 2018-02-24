import React from 'react';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom';
import forms from '../forms';
import { user } from '../auth';
import { Login } from './Login';
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
        this.form = forms[thisFormName];
    }

    render() {
        const returnUrlPart = `?returnTo=${encodeURIComponent(window.location.pathname)}`;
        const loginUrl = (provider) => `/auth/login/${provider}${returnUrlPart}`;

        return <div className="form">
            <img className="headerImage" src={this.form.image} alt={this.form.title} />
            <Link to="/">&lt;&lt;&nbsp;Go&nbsp;Back</Link>
            <h1>{this.form.title}</h1>
            {
                user
                    ? <div>
                        <Route exact path="/register/:id/" render={() => <div>home</div>} />
                        <Route exact path="/register/:id/step1" render={() => <div>step1</div>} />
                        <Route exact path="/register/:id/step2" render={() => <div>step2</div>} />
                    </div>
                    : <Login />
            }
        </div>;
    }
}