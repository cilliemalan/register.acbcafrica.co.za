import React from 'react';
import logoUrl from '../content/logo.png'
import { Link } from 'react-router-dom'

export const Header = (props) =>
    <nav>
        <Link to="/" className="navlogo">
            <img src={logoUrl} alt="ACBC Africa Registration Home" title="ACBC Africa Registration Home" />
            <span>ACBC Africa Registration</span>
        </Link>
    </nav>;