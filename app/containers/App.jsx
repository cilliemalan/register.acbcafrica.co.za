import React from 'react';
import { Route, Link, BrowserRouter, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { Home } from '../containers/Home';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TermsAndConditions } from '../components/TermsAndConditions';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { NotFound } from '../components/NotFound';
import { Register } from '../components/Register';
import { fetchFormsIfNeeded } from '../actions';
import { Spinner } from '../components/Spinner';

const mapStateToProps = state => {
    return ({ forms: state.forms.items, loading: state.forms.loading });
}


class App extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchFormsIfNeeded());
    }

    render() {
        const { forms, loading } = this.props;

        const formFor = (formId) => {
            if (loading) {
                return <Spinner />
            } else {
                return forms[formId]
                    ? <Register fillingForm={forms[formId]} />
                    : <NotFound />;
            }
        }


        return <div>
                <Header />
                <div id="mainContent">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/terms-and-conditions" component={TermsAndConditions} />
                        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                        <Route path="/register/:id" render={({ match }) => formFor(match.params.id)} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
                <Footer />
            </div>;
    }
}

App = withRouter(connect(mapStateToProps)(App));

export { App };
