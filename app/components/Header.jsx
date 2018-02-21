import React from 'react';
import logoUrl from '../content/logo.png'
import { Link } from 'react-router-dom'
import { user } from '../auth';

export const Header = (props) => {
    const loggedIn = !!user;
    return <nav>
        <Link to="/" className="navlogo">
            <img src={logoUrl} alt="ACBC Africa Registration Home" title="ACBC Africa Registration Home" />
            <span>ACBC Africa Registration</span>
        </Link>
        <div className="profile">
            {!loggedIn
                ? <div>
                    Not Signed in.&nbsp;<a href="/auth/login">Sign in</a>&nbsp;or&nbsp;<a href="/auth/login">register</a>.
                </div>
                : <div>
                    <span>Signed in as {user.name}<br /> <a href="/auth/logout">Sign out</a></span>
                    <img src={user.picture} alt={user.name} />
                </div>
            }
        </div>
    </nav>
};