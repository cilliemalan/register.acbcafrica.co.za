import React from 'react';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { Home } from '../containers/Home';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TermsAndConditions } from '../components/TermsAndConditions';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { NotFound } from '../components/NotFound';
import { Form } from '../components/Form';

const mapStateToProps = state => ({ forms: state.forms.items });

let App = ({ forms }) =>
    <BrowserRouter>
        <div>
            <Header />
            <div id="mainContent">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/terms-and-conditions" component={TermsAndConditions} />
                    <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                    <Route path="/register/:id" render={({id}) => <Form form={forms[id]} />} />
                    <Route component={NotFound} />
                </Switch>
            </div>
            <Footer />
        </div>
    </BrowserRouter>;

App = connect(mapStateToProps)(App);

export { App };
