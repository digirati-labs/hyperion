import { createStore as createReduxStore, applyMiddleware, combineReducers, compose, Store } from 'redux';
import { Epic } from 'redux-observable';
import reducers from './reducers';
import epics from './epics';

const composeEnhancers =
  typeof window !== 'undefined' ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

export function createStore(
  customReducers: any = {},
  extraMiddleware: any[] = [],
  customEpics: Epic[] = [],
  defaultState: any = {}
): Store {
  const { ajax } = require('rxjs/ajax');
  const { combineEpics, createEpicMiddleware } = require('redux-observable');

  const rootEpic = combineEpics(...customEpics, ...epics);

  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      fetch: ajax.getJSON,
    },
  });

  const store = createReduxStore(
    combineReducers({ hyperion: reducers, ...customReducers }),
    defaultState,
    composeEnhancers(applyMiddleware(epicMiddleware, ...extraMiddleware))
  );

  epicMiddleware.run(rootEpic);

  return store as any;
}