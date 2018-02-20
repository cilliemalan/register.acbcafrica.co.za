import React from 'react';
import { Route, Link, BrowserRouter } from 'react-router-dom'
import { Home } from './components/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TermsAndConditions } from './components/TermsAndConditions';
import { PrivacyPolicy } from './components/PrivacyPolicy';

export function App(props) {
    return <BrowserRouter>
        <div>
            <Header />
            <div id="mainContent">
                <Route exact path="/" render={Home} />
                <Route exact path="/terms-and-conditions/" render={TermsAndConditions} />
                <Route exact path="/privacy-policy/" render={PrivacyPolicy} />
            </div>
            <Footer />
        </div>
    </BrowserRouter>;
}