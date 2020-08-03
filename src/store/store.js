import { createStore, combineReducers } from 'redux';
import allReducers from './reducers';

const reducer = combineReducers(allReducers);
const store = createStore(reducer);

export default store;
