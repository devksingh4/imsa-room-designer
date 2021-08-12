import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Switch
} from "react-router-dom";

// Screens
import Home from './Home';
import Scheduler from './Scheduler';
import NotFound from './NotFound';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path="/" exact     component={ Home } />
                <Route path="/home" exact     component={ Home } />
                <Route path="/scheduler"     component={ Scheduler } />
                <Route path='/view'>
                    <Scheduler hide={true} />
                </Route>
                <Route component={NotFound} />
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
