import { createStore as createReduxStore, applyMiddleware, combineReducers, compose } from 'redux';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import reducers from './reducers';
import epics from './epics';
import { ajax } from 'rxjs/ajax';

const composeEnhancers = window ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

export default function createStore(
  customReducers = {},
  extraMiddleware: any[] = [],
  customEpics: Epic[] = [],
  defaultState = {}
) {
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

  return store;
}
