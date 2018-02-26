import './styles/main.scss';
import ReactDOM from 'react-dom';
import React from 'react';
import { App } from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';

// where the app will go
const approot = document.getElementById('react-app');

// the redux store
const store = createStore(reducer);

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

    module.hot.accept('./App', () =>
        render(makeHot(reduxify(require('./App').App))));

    render(makeHot(reduxify(App)));
} else {

    render(reduxify(App));
}
