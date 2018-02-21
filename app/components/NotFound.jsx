import React from 'react';
import { Link } from 'react-router-dom'


export const NotFound = () =>
    <div id="notfound">
        <h1>404 Not Found</h1>
        <p>This page does not exist.</p>
        <a href="https://acbcafrica.co.za">Go back to the ACBC Africa website.</a>
        <Link to="/">Go back to the registration page.</Link>
    </div>;