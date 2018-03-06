import React from 'react';
import { Link } from 'react-router-dom';
import { formatCost } from '../helpers/formatting';

export const PaymentDetails = ({ submission: { form, details: { options: { total }, lastname, firstname } } }) => {
    return <div>
        <h2>Payment</h2>
        <p>
            Please direct payments to the SMTI Bank Account:<br />
            <br />
            Payment Reference: <strong>{form}-{lastname} {firstname}</strong><br />
            Amount: <strong>{formatCost(total)}</strong>< br/>
            Account Holder: <strong>Strengthening Ministries Training Institute</strong><br />
            Bank: <strong>Standard Bank</strong><br />
            Branch Code: <strong>051001</strong><br />
            Account Number: <strong>013350692</strong><br />
            Account Type: <strong>Current</strong><br />
            <br />
            Please Email proof of payment to: <a href="mailto:admin@acbcafrica.co.za">admin@acbcafrica.co.za</a>
        </p>
    </div>;
}