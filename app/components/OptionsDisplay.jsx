import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatCost } from '../helpers/formatting';


export const OptionsDisplay = ({ options, selection }) => {

    const optionkeys = Object.keys(options).filter(x => selection[x]);
    const total = selection.total;

    return <div>
        <h2>Registering for:</h2>
        <ul className="conference-items-display">
            {optionkeys.map(key => {
                const option = options[key];
                const selected = selection[key];
                const formattedDate = formatDate(option.from, option.to);
                const formattedCost = formatCost(option.cost);
                return <li key={key}>
                    <div className="title">{option.title}</div>
                    { option.subtitle && <div className="subtitle">{option.subtitle}</div> }
                    <div className="date">{formattedDate}</div>
                    <div className="cost"><label>Cost:&nbsp;</label>{formattedCost}</div>
                </li>;
            })}
        </ul>
        <div className="total">
            <label>Total Cost:&nbsp;</label>
            {formatCost(total)}
        </div>
    </div>;
};