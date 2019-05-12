import { catchError } from 'rxjs/internal/operators/catchError';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { filter } from 'rxjs/internal/operators/filter';

import { Epic } from 'redux-observable';
import {
  actionListFromResource,
  AllActions,
  requestError,
  requestResource,
} from './entities';
import { isActionOf } from 'typesafe-actions';
import { ajax } from 'rxjs/ajax';
import { VaultState } from '../Vault';
import { of } from 'rxjs/internal/observable/of';

const requestEpic: Epic<AllActions, AllActions, VaultState, { fetch: typeof ajax.getJSON }> = (
  action$,
  store,
  { fetch }
) =>
  action$.pipe(
    filter(isActionOf(requestResource)),
    mergeMap(({ payload }) =>
      fetch(payload.id).pipe(
        mergeMap(actionListFromResource(payload.id)),
        catchError(error => of(requestError({ id: payload.id, message: error.toString() })))
      )
    )
  );

export default requestEpic;
