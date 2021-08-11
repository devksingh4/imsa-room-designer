import React from 'react';
import './index.css'
import {CustomNavbar} from "./CustomNavbar";
import "firebase/auth";
import MyCatalog from './catalog/mycatalog';
import {
    Models as PlannerModels,
    reducer as PlannerReducer,
    ReactPlanner,
    Plugins as PlannerPlugins,
    // @ts-ignore
} from 'react-planner';
import {Map} from 'immutable';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
let AppState = Map({
    'react-planner': new PlannerModels.State()
});

//define reducer
let reducer = (state: Map<string, any>, action: any) => {
    state = state || AppState;
    state = state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
    return state;
};

// @ts-ignore
let store = createStore(reducer, null, window.devToolsExtension ? window.devToolsExtension() : f => f);

function Designer() {
    // @ts-ignore
    return (
        <div>
            <CustomNavbar active='designer'/>
                <ReactPlanner
                    catalog={MyCatalog}
                    width={800}
                    height={600}
                    stateExtractor={state => state.get('react-planner')}
                    store={store as any}
                />
        </div>

);
}

export default Designer;
