import { catchError } from 'rxjs/internal/operators/catchError';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { filter } from 'rxjs/internal/operators/filter';

import { Epic } from 'redux-observable';
import {
  addMapping,
  addMappings,
  AllActions,
  importEntities,
  requestComplete,
  requestError,
  requestMismatch,
  requestResource,
} from './entities';
import { isActionOf } from 'typesafe-actions';
import { ajax } from 'rxjs/ajax';
import { VaultState } from '../Vault';
import {normalize, TraversableEntityTypes} from '..';
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
        mergeMap(response => {
          const { entities, resource, mapping } = normalize(response);
          if (resource.id === undefined) {
            return [requestError({ id: payload.id, message: 'ID is not defined in resource.' })];
          }
          // Always import and add mappings.
          const actions: AllActions[] = [importEntities({ entities }), addMappings({ mapping })];
          // Check if we have a resource mismatch
          if (resource.id !== payload.id) {
            actions.push(addMapping({ id: payload.id, type: resource.type as TraversableEntityTypes }));
            actions.push(requestMismatch({ requestId: payload.id, actualId: resource.id }));
          }
          // Finally mark as complete.
          actions.push(requestComplete({ id: payload.id }));
          // and return.
          return actions;
        }),
        catchError(error => of(requestError({ id: payload.id, message: error.toString() })))
      )
    )
  );

export default requestEpic;
