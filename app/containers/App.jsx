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
import { fetchFormsIfNeeded, stageRegistration, submitRegistration } from '../actions';
import { Spinner } from '../components/Spinner';
import { RegistrationDone } from '../components/RegistrationDone';

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
    
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
      }
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

    onConfirmationSubmit(submission) {
        const { form, details } = submission;
        const { dispatch } = this.props;
        dispatch(submitRegistration(form, details));
    }

    render() {
        const { forms, loading, submission, history } = this.props;
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

        const confirmation = () =>
            <RegistrationConfirmation
                submission={submission}
                forms={forms}
                onCancel={() => history.goBack()}
                onSubmit={() => this.onConfirmationSubmit(submission)} />;


        return <div>
            <Header />
            <div id="mainContent">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/terms-and-conditions" component={TermsAndConditions} />
                    <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                    {hasSubmission && <Route exact path="/register/confirm" render={confirmation} />}
                    <Route exact path="/register/done" component={RegistrationDone} />
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
