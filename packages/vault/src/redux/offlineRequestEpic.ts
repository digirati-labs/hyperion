import { catchError } from 'rxjs/internal/operators/catchError';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { filter } from 'rxjs/internal/operators/filter';

import { Epic } from 'redux-observable';
import { actionListFromResource, AllActions, requestError, requestOfflineResource } from './entities';
import { isActionOf } from 'typesafe-actions';
import { VaultState } from '../Vault';
import { of } from 'rxjs/internal/observable/of';

const offlineRequestEpic: Epic<AllActions, AllActions, VaultState> = action$ =>
  action$.pipe(
    filter(isActionOf(requestOfflineResource)),
    mergeMap(({ payload }) =>
      of(payload.entity).pipe(
        mergeMap(actionListFromResource(payload.id)),
        catchError(error => of(requestError({ id: payload.id, message: error.toString() })))
      )
    )
  );

export default offlineRequestEpic;
