import './styles/main.scss';
import ReactDOM from 'react-dom';
import React from 'react';
import { App } from './containers/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';

// where the app will go
const approot = document.getElementById('react-app');

// the redux store
const store = createStore(reducer, applyMiddleware(thunk));

// some helper functions
const reduxify = (Root) =>
    <Provider store={store}>
        <Root />
    </Provider>;

const makeHot = (rootElement) => React.createElement(
    require('react-hot-loader').AppContainer,
    null,
    rootElement);

const render = (rootElement) =>
    ReactDOM.render(rootElement, approot);



if (module.hot) {

    module.hot.accept('./containers/App', () =>
        render(makeHot(reduxify(require('./containers/App').App))));

    render(makeHot(reduxify(App)));
} else {

    render(reduxify(App));
}
