import { createAction, ActionType } from 'typesafe-actions';
import { Entities } from '@hyperion-framework/types';
import { getDefaultEntities } from '@hyperion-framework/parser';

export const IMPORT_ENTITIES = '@hyperion/IMPORT_ENTITIES';

export const MODIFY_ENTITY_FIELD = '@hyperion/MODIFY_ENTITY_FIELD';

export const importEntities = createAction(IMPORT_ENTITIES)<{ entities: Entities }>();

export const modifyEntityField = createAction(MODIFY_ENTITY_FIELD)<{
  type: keyof Entities;
  id: string;
  key: string;
  value: any;
}>();

export const entityActions = { importEntities, modifyEntityField };

export type EntityActions = ActionType<typeof entityActions>;

export const entityReducer = (
  state: Entities = getDefaultEntities(),
  action: ActionType<typeof importEntities> | ActionType<typeof modifyEntityField>
) => {
  if (action.type === MODIFY_ENTITY_FIELD) {
    // Invalid.
    if (!state[action.payload.type] || !state[action.payload.type][action.payload.id]) {
      return state;
    }

    const entity = state[action.payload.type][action.payload.id];
    if (typeof entity === 'string') {
      return state;
    }

    return {
      ...state,
      [action.payload.type]: {
        ...state[action.payload.type],
        [action.payload.id]: {
          ...entity,
          [action.payload.key]: action.payload.value,
        },
      },
    };
  }

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
