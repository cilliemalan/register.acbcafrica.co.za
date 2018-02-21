import React from 'react';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom'
import forms from '../forms';
import { user } from '../auth';
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
                    : <div>
                        <p>Before we can continue with your registration, please verify your identity by signing in.</p>
                        <p>Once you are signed in you will be able to register yourself or others, and manage past registrations.</p>
                        <h2>Choose Sign in method:</h2>
                        <ul class="signInMethods">
                            <li>
                                <a href={loginUrl('facebook')}>
                                    <img src={facebook_logo} alt="Facebook login" />
                                    <div>Sign in using Facebook</div>
                                </a>
                            </li>
                            <li>
                                <a href={loginUrl('google')}>
                                    <img src={google_logo} alt="Google login" />
                                    <div>Sign in using Google</div>
                                </a>
                            </li>
                            <li>
                                <a href={loginUrl()}>
                                    <img src={padlock_image} alt="Google login" />
                                    <div>Email & Password</div>
                                </a>
                            </li>
                        </ul>
                        <h2>Not Registered?</h2>
                        <p>
                            If you have a social media account you can log in above.
                            Alternatively you can register using any email address or
                            password:
                        </p>
                        <ul class="signInMethods">
                            <li>
                                <a href={loginUrl()}>
                                    <img src={padlock_image} alt="Google login" />
                                    <div>Register Email & Password</div>
                                </a>
                            </li>
                        </ul>
                    </div>
            }
        </div>;
    }
}