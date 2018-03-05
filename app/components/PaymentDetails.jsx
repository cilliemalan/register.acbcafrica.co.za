import React from 'react';
import { Link } from 'react-router-dom';

export const PaymentDetails = ({ submission: { form, details: { total, lastname, firstname } } }) => {
    return <div>
        <h2>Payment</h2>
        <p>Total Cost: <strong>{total}</strong></p>
        <h3>Bank Account</h3>
        <p>
            Please direct payments to the SMTI Bank Account:<br />
            <br />
            Account Holder: <strong>Strengthening Ministries Training Institute</strong><br />
            Bank: <strong>Standard Bank</strong><br />
            Branch Code: <strong>051001</strong><br />
            Account Number: <strong>013350692</strong><br />
            Account Type: <strong>Current</strong><br />
            <br />
            Please specify as your payment reference: <strong>{form}-{lastname} {firstname}</strong><br />
            <br />
            Please Email proof of payment to: <a href="mailto:admin@acbcafrica.co.za">admin@acbcafrica.co.za</a>
        </p>
    </div>;
}