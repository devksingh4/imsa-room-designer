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
import ViewSchedules from './ViewSchedules';
import NotFound from './NotFound';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path="/" exact     component={ Home } />
                <Route path="/home" exact     component={ Home } />
                <Route path="/scheduler" exact     component={ Scheduler } />
                <Route path="/view-schedules" exact     component={ ViewSchedules } />
                <Route path='/view' exact>
                    <Scheduler hide={true} />
                </Route>
                <Route path='/scheduler/edit' exact>
                    <Scheduler edit={true} />
                </Route>
                <Route component={NotFound} />
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
