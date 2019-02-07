import { combineReducers } from 'redux';
import { entityReducer, mappingReducer, requestReducer } from './entities';

export default combineReducers({ mapping: mappingReducer, entities: entityReducer, requests: requestReducer });
