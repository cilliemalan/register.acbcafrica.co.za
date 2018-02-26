import React from 'react';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom'
import { Home } from './components/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TermsAndConditions } from './components/TermsAndConditions';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { NotFound } from './components/NotFound';
import { Form } from './components/Form';

export const App = () =>
    <BrowserRouter>
        <div>
            <Header />
            <div id="mainContent">
                <Switch>
                    <Route exact path="/" render={Home} />
                    <Route exact path="/terms-and-conditions" render={TermsAndConditions} />
                    <Route exact path="/privacy-policy" render={PrivacyPolicy} />
                    <Route path="/register/:id" component={Form} />
                    <Route component={NotFound} />
                </Switch>
            </div>
            <Footer />
        </div>
    </BrowserRouter>;