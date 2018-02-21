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
    }

    render() {
        return <div className="form">
            <img className="headerImage" src={this.form.image} alt={this.form.title} />
            <h1>{this.form.title}</h1>
        </div>;
    }
}