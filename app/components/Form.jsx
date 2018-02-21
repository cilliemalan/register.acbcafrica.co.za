import React from 'react';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom'
import forms from '../forms';

export class Form extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const props = this.props;
        const thisFormName = props.match.params.id;
        this.form = forms[thisFormName];

        console.log('ffff');
        console.log(thisFormName);
        console.log(this.form);
    }

    render() {

        return <div>Forms</div>;
    }
}