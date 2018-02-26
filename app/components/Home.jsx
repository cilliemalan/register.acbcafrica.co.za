import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
const Fragment = React.Fragment;



const mapStateToProps = (state) => ({
    forms: state.forms.items,
    loading: state.forms.loading
});

let Home = ({ forms, loading }) => {

    const sortedForms = Object.keys(forms);
    const any = !!sortedForms.length;
    sortedForms.sort((a, b) => forms[a].from > forms[b].from);

    const loadingMessage = () => "Loading...";
    const nothingMessage = () => "Nothing is available at this time. Please check again later!";
    const formList = () => (any ? (<Fragment>
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
    </ Fragment>) : nothingMessage());

    return <div>
        <h1>ACBC Africa Registration</h1>
        {loading
            ? loadingMessage()
            : formList()}
    </div>
};

Home = connect(mapStateToProps)(Home);

export { Home };