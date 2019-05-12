import { createStandardAction, ActionType } from 'typesafe-actions';
import produce from 'immer';
import {defaultEntities, Entities, Mapping, normalize} from '../processing/normalize';
import { TraversableEntityTypes } from '../processing/traverse';

// Entities
export const IMPORT_ENTITIES = '@hyperion/IMPORT_ENTITIES';

export const importEntities = createStandardAction(IMPORT_ENTITIES)<{ entities: Entities }>();

export const entityReducer = (state: Entities = defaultEntities, action: ActionType<typeof importEntities> | AllActions) => {
  if (action.type === IMPORT_ENTITIES) {
    return {
      Collection: {
        ...state.Collection,
        ...action.payload.entities.Collection,
      },
      Manifest: {
        ...state.Manifest,
        ...action.payload.entities.Manifest,
      },
      Canvas: {
        ...state.Canvas,
        ...action.payload.entities.Canvas,
      },
      AnnotationPage: {
        ...state.AnnotationPage,
        ...action.payload.entities.AnnotationPage,
      },
      AnnotationCollection: {
        ...state.AnnotationCollection,
        ...action.payload.entities.AnnotationCollection,
      },
      Annotation: {
        ...state.Annotation,
        ...action.payload.entities.Annotation,
      },
      ContentResource: {
        ...state.ContentResource,
        ...action.payload.entities.ContentResource,
      },
      Range: {
        ...state.Range,
        ...action.payload.entities.Range,
      },
      Service: {
        ...state.Service,
        ...action.payload.entities.Service,
      },
      Selector: {
        ...state.Selector,
        ...action.payload.entities.Selector,
      },
    };
  }
  return state;
};

// Mapping
export const ADD_MAPPING = '@hyperion/ADD_MAPPING';
export const ADD_MAPPINGS = '@hyperion/ADD_MAPPINGS';

export const addMapping = createStandardAction(ADD_MAPPING)<{ id: string; type: TraversableEntityTypes }>();
export const addMappings = createStandardAction(ADD_MAPPINGS)<{ mapping: { [id: string]: TraversableEntityTypes } }>();

export const mappingReducer = (state: Mapping = {}, action: ActionType<typeof mappingActions> | any) =>
  produce(state, (draft: Mapping) => {
    switch (action.type) {
      case ADD_MAPPING:
        draft[action.payload.id] = action.payload.type;
        return draft;
      case ADD_MAPPINGS:
        return {
          ...state,
          ...action.payload.mapping,
        };
    }
    return draft;
  });

// Requests
export const RESOURCE_ERROR = 'RESOURCE_ERROR';
export const RESOURCE_LOADING = 'RESOURCE_LOADING';
export const RESOURCE_READY = 'RESOURCE_READY';

export type RequestState = {
  [id: string]: {
    // This may expand with time requested and other request specific details.
    loadingState: 'RESOURCE_ERROR' | 'RESOURCE_LOADING' | 'RESOURCE_READY';
    uriMismatch: boolean;
    requestUri: string;
    resourceUri: string;
    error?: string;
  };
};

export const REQUEST_RESOURCE = '@hyperion/REQUEST_RESOURCE';
export const REQUEST_ERROR = '@hyperion/REQUEST_ERROR';
export const REQUEST_MISMATCH = '@hyperion/REQUEST_MISMATCH';
export const REQUEST_COMPLETE = '@hyperion/REQUEST_COMPLETE';
export const REQUEST_OFFLINE_RESOURCE = '@hyperion/REQUEST_OFFLINE_RESOURCE';

export const requestResource = createStandardAction(REQUEST_RESOURCE)<{ id: string }>();
export const requestError = createStandardAction(REQUEST_ERROR)<{ id: string; message: string }>();
export const requestMismatch = createStandardAction(REQUEST_MISMATCH)<{ requestId: string; actualId: string }>();
export const requestComplete = createStandardAction(REQUEST_COMPLETE)<{ id: string }>();
export const requestOfflineResource = createStandardAction(REQUEST_OFFLINE_RESOURCE)<{ id: string, entity: unknown }>();

export const requestReducer = (state: RequestState = {}, action: ActionType<typeof requestActions> | any) =>
  produce(state, (draft: RequestState) => {
    switch (action.type) {
      case REQUEST_RESOURCE:
      case REQUEST_OFFLINE_RESOURCE:
        draft[action.payload.id] = {
          requestUri: action.payload.id,
          loadingState: 'RESOURCE_LOADING',
          uriMismatch: false,
          resourceUri: action.payload.id,
        };
        break;
      case REQUEST_MISMATCH:
        draft[action.payload.requestId].uriMismatch = true;
        draft[action.payload.requestId].resourceUri = action.payload.actualId;
        draft[action.payload.actualId] = {
          requestUri: action.payload.requestId,
          loadingState: state[action.payload.requestId].loadingState,
          uriMismatch: true,
          resourceUri: action.payload.actualId,
        };
        break;
      case REQUEST_ERROR:
        draft[action.payload.id].loadingState = 'RESOURCE_ERROR';
        draft[action.payload.id].error = action.payload.message;
        break;
      case REQUEST_COMPLETE:
        draft[action.payload.id].loadingState = 'RESOURCE_READY';
        break;
    }
    return draft;
  });

// Action groups.
export const mappingActions = { addMapping, addMappings };
export const requestActions = { requestResource, requestError, requestMismatch, requestComplete, requestOfflineResource };
export const importActions = { importEntities };

// Action types.
export type MappingActions = ActionType<typeof mappingActions>;
export type RequestActions = ActionType<typeof requestActions>;
export type ImportActions = ActionType<typeof importActions>;
export type AllActions = MappingActions | RequestActions | ImportActions;

// Helpers.
export const actionListFromResource = (id: string) => (response: unknown) => {
  const { entities, resource, mapping } = normalize(response);
  if (resource.id === undefined) {
    return [requestError({ id, message: 'ID is not defined in resource.' })];
  }
  // Always import and add mappings.
  const actions: AllActions[] = [importEntities({ entities }), addMappings({ mapping })];
  // Check if we have a resource mismatch
  if (resource.id !== id) {
    actions.push(addMapping({ id, type: resource.type as TraversableEntityTypes }));
    actions.push(requestMismatch({ requestId: id, actualId: resource.id }));
  }
  // Finally mark as complete.
  actions.push(requestComplete({ id }));
  // and return.
  return actions;
};
