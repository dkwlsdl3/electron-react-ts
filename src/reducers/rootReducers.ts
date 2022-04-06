import { deliveryInitialState, deliveryReducer } from './delivery';
import { keywordInitialState, keywordReducer } from './keyword';

function combineReducers(reducers: any) {
    return (state: any = {}, action: any) => {
        const newState: any = {};
        for (const key in reducers) {
            newState[key] = reducers[key](state[key], action);
        }
        return newState;
    };
}

export const rootReducers = combineReducers({
    keyword: keywordReducer,
    delivery: deliveryReducer,
});

export const initialState = {
    keyword: keywordInitialState,
    delivery: deliveryInitialState,
};
