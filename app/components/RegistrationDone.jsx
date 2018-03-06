import React from 'react';
import check from '../content/check.png';
import { Link } from 'react-router-dom'

export const RegistrationDone = () =>
    <div className="registration-success">
        <img src={check} alt="✔️" className="check" />
        <h1>Registration Successful!</h1>
        <a href="https://acbcafrica.co.za">Go back to the ACBC Africa website.</a>
        <Link to="/">Go back to the registration page.</Link>
    </div>