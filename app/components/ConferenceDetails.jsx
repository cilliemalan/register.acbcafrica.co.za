import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateSentence } from '../helpers/formatting';

export const ConferenceDetails = ({ form, message }) => {

    const { from, to, location, address, title, online } = form;
    const dateDisplay = formatDateSentence(form.from, form.to);

    const registeringForLine = <p>
        You are registering for {" "}
        <strong>{title}</strong>.
    </p>;

    const locationLine = location ?
        <p>The conference will be held at {" "}
            <strong>{location}</strong>: {" "}
            ({address} <a href={`https://www.google.co.za/maps/search/${encodeURIComponent(address)}?hl=en&source=opensearch`} target="blank">see map</a>) {" "}
            <strong>{dateDisplay}</strong>.
        </p>
        : undefined;

    const onlineLine = online ?
        <p>The conference will be <strong>online</strong>. As soon as the online sessions are available you will receive info on how to access them.</p>
        : undefined;

    const messageLine = message ?
        <p>{message}</p>
        : undefined;

    return <div>
        {registeringForLine}
        {locationLine}
        {onlineLine}
        {messageLine}
    </div>;
}
