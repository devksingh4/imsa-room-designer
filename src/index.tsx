import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Switch
} from "react-router-dom";

// Screens
import Home from './Home';
import Designer from './Designer';
import NotFound from './NotFound';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path="/" exact     component={ Home } />
                <Route path="/home" exact     component={ Home } />
                <Route path="/designer"     component={ Designer } />
                <Route component={NotFound} />
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
