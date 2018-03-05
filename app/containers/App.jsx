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
import { RegistrationConfirmation } from '../components/RegistrationConfirmation';
import { fetchFormsIfNeeded, stageRegistration } from '../actions';
import { Spinner } from '../components/Spinner';

const mapStateToProps = state => {
    return ({
        forms: state.forms.items,
        loading: state.forms.loading,
        submission: state.submission
    });
}


class App extends React.Component {

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchFormsIfNeeded());
    }

    onFormSubmit(form, values) {
        const { dispatch, history } = this.props;
        dispatch(stageRegistration(form, values));
        history.push('/register/confirm');
    }

    render() {
        const { forms, loading, submission } = this.props;
        const hasSubmission = !!submission.details;

        const formFor = (formId, history) => {
            if (loading) {
                return <Spinner />
            } else {
                return forms[formId]
                    ? <Register fillingForm={forms[formId]} onSubmit={(v) => this.onFormSubmit(formId, v)} />
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
                        { hasSubmission && <Route exact path="/register/confirm" render={() => <RegistrationConfirmation submission={submission} />} /> }
                        <Route path="/register/:id" render={({ match, history }) => formFor(match.params.id, history)} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
                <Footer />
            </div>;
    }
}

App = withRouter(connect(mapStateToProps)(App));

export { App };
