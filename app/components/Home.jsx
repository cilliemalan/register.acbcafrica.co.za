import React from 'react';
import { Link } from 'react-router-dom';
import forms from './forms';

export const Home = (props) => {

    const sortedForms = Object.keys(forms);
    sortedForms.sort((a, b) => forms[a].from > forms[b].from);

    return <div>
        <h1>ACBC Africa Registration</h1>

        <p>What would you like to register for?</p>
        <ul className="formSelection">
            {
                sortedForms.map(k =>
                    <li key={k}>
                        <Link to={`/${k}`}>
                            <img src={forms[k].image} alt={forms[k].title} />
                        </Link>
                    </li>)
            }
        </ul>
    </div>
};