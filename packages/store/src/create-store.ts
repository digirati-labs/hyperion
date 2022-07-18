import { createStore as createReduxStore, applyMiddleware, combineReducers, compose } from 'redux';
import { mappingReducer } from './reducers/mapping';
import { entityReducer } from './reducers/entities';
import { requestReducer } from './reducers/request';
import { metaReducer } from './reducers/meta';
import { ReduxStore } from './types';

export const reducers = combineReducers({
  mapping: mappingReducer,
  entities: entityReducer,
  requests: requestReducer,
  meta: metaReducer,
});

const composeEnhancers =
  typeof window !== 'undefined' ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

export function createStore(customReducers: any = {}, extraMiddleware: any[] = [], defaultState: any = {}): ReduxStore {
  const store = createReduxStore(
    combineReducers({ hyperion: reducers, ...customReducers }),
    defaultState,
    composeEnhancers(applyMiddleware(...extraMiddleware))
  );

  return store as any;
}
