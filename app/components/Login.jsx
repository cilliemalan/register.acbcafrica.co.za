import React from 'react';

export const Login = () => {
    return <div>
        <p>Before we can continue with your registration, please verify your identity by signing in.</p>
        <p>Once you are signed in you will be able to register yourself <strong>or others</strong>, and manage past registrations.</p>
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
    </div>;
}