import React from 'react';
import { Route, Link, BrowserRouter } from 'react-router-dom'
import { Home } from './components/Home';

export function App(props) {
    return <BrowserRouter>
        <div>
            <nav>
                <Link to="/">Home</Link>
            </nav>
            <Route exact path="/" component={Home} />
        </div>
    </BrowserRouter>;
}