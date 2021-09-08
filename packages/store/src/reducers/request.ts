import { ActionType } from 'typesafe-actions';
import { createAction } from 'typesafe-actions';
import { RequestState } from '@hyperion-framework/types';

export const RESOURCE_ERROR = 'RESOURCE_ERROR';
export const RESOURCE_LOADING = 'RESOURCE_LOADING';
export const RESOURCE_READY = 'RESOURCE_READY';

export const REQUEST_RESOURCE = '@hyperion/REQUEST_RESOURCE';
export const REQUEST_ERROR = '@hyperion/REQUEST_ERROR';
export const REQUEST_MISMATCH = '@hyperion/REQUEST_MISMATCH';
export const REQUEST_COMPLETE = '@hyperion/REQUEST_COMPLETE';
export const REQUEST_OFFLINE_RESOURCE = '@hyperion/REQUEST_OFFLINE_RESOURCE';

export const requestResource = createAction(REQUEST_RESOURCE)<{ id: string }>();
export const requestError = createAction(REQUEST_ERROR)<{ id: string; message: string }>();
export const requestMismatch = createAction(REQUEST_MISMATCH)<{ requestId: string; actualId: string }>();
export const requestComplete = createAction(REQUEST_COMPLETE)<{ id: string }>();
export const requestOfflineResource = createAction(REQUEST_OFFLINE_RESOURCE)<{ id: string; entity: unknown }>();

export const requestActions = {
  requestResource,
  requestError,
  requestMismatch,
  requestComplete,
  requestOfflineResource,
};

export type RequestActions = ActionType<typeof requestActions>;

export const requestReducer = (state: RequestState = {}, action: ActionType<typeof requestActions> | any) => {
  switch (action.type) {
    case REQUEST_RESOURCE:
    case REQUEST_OFFLINE_RESOURCE:
      return {
        ...state,
        [action.payload.id]: {
          requestUri: action.payload.id,
          loadingState: 'RESOURCE_LOADING',
          uriMismatch: false,
          resourceUri: action.payload.id,
        },
      };
      break;
    case REQUEST_MISMATCH:
      return {
        ...state,
        [action.payload.requestId]: {
          ...(state[action.payload.requestId] || {}),
          uriMismatch: true,
          resourceUri: action.payload.actualId,
        },
        [action.payload.actualId]: {
          requestUri: action.payload.requestId,
          loadingState: state[action.payload.requestId].loadingState,
          uriMismatch: true,
          resourceUri: action.payload.actualId,
        },
      };
    case REQUEST_ERROR:
      return {
        ...state,
        [action.payload.id]: {
          ...(state[action.payload.id] || {}),
          loadingState: 'RESOURCE_ERROR',
          error: action.payload.message,
        },
      };
      break;
    case REQUEST_COMPLETE:
      return {
        ...state,
        [action.payload.id]: {
          ...(state[action.payload.id] || {}),
          loadingState: 'RESOURCE_READY',
          error: undefined,
        },
      };
      break;
  }
  return state;
};
