import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchForms } from '../actions';
import { Spinner } from '../components/Spinner';
import moment from 'moment';
const Fragment = React.Fragment;

const mapStateToProps = (state) => ({
    forms: state.forms.items,
    loading: state.forms.loading
});

class Home extends React.Component {

    render() {
        const { forms, loading } = this.props;

        const isRelevant = (k) => {
            const form = forms[k];
            return (!form.to && !form.from) || moment(form.to || form.from).isAfter(moment().add(1, 'week'));
        }

        const sortedForms = Object.keys(forms).filter(isRelevant);
        const any = !!sortedForms.length;
        sortedForms.sort((a, b) => forms[a].from > forms[b].from);

        const loadingMessage = () => <Spinner />;
        const nothingMessage = () => "Nothing is available at this time. Please check again later!";
        const formListItems = () => <Fragment>
            <p>What would you like to register for?</p>
            <ul className="formSelection">
                {
                    sortedForms.map(k =>
                        <li key={k}>
                            <Link to={`/register/${k}`}>
                                <img src={forms[k].image} alt={forms[k].title} />
                            </Link>
                        </li>)
                }
            </ul>
        </ Fragment>;
        const formList = () => (any ? formListItems() : nothingMessage());

        return <div>
            <h1>ACBC Africa Registration</h1>
            {loading
                ? loadingMessage()
                : formList()}
        </div>
    }
}

Home = connect(mapStateToProps)(Home);

export { Home };