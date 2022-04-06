import React, { createContext, useReducer } from 'react';
import { hot } from 'react-hot-loader';
import PageRouter from './PageRouter';
import { initialState, rootReducers } from './reducers/rootReducers';

export const AppDispatch = createContext<any>(null);
export const AppStore = createContext(initialState);

const App = () => {
    const [state, dispatch] = useReducer(rootReducers, initialState);
    return (
        <AppDispatch.Provider value={dispatch}>
            <AppStore.Provider value={state}>
                <PageRouter />
            </AppStore.Provider>
        </AppDispatch.Provider>
    );
};

export default hot(module)(App);
