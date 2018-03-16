import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateSentence } from '../helpers/formatting';

export const ConferenceDetails = ({ form, message }) => {

    const { from, to, location, address, title } = form;
    const dateDisplay = formatDateSentence(form.from, form.to);

    return <div>
        <p>
            You are registering for {" "}
            <strong>{title}</strong>.
        </p>
        <p>The conference will be held at {" "}
            <strong>{location}</strong>: {" "}
            ({address} <a href={`https://www.google.co.za/maps/search/${encodeURIComponent(address)}?hl=en&source=opensearch`} target="blank">see map</a>) {" "}
            <strong>{dateDisplay}</strong>.
        </p>
        <p>{message}</p>
    </div>;
}
