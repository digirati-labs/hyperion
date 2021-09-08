import { ActionType, createAction } from 'typesafe-actions';
import { EntityMapping, TraversableEntityTypes } from '@hyperion-framework/types';

export const ADD_MAPPING = '@hyperion/ADD_MAPPING';
export const ADD_MAPPINGS = '@hyperion/ADD_MAPPINGS';

export const addMapping = createAction(ADD_MAPPING)<{ id: string; type: TraversableEntityTypes }>();
export const addMappings = createAction(ADD_MAPPINGS)<{ mapping: { [id: string]: TraversableEntityTypes } }>();

export const mappingActions = { addMapping, addMappings };

export type MappingActions = ActionType<typeof mappingActions>;

export const mappingReducer = (state: EntityMapping = {}, action: ActionType<typeof mappingActions> | any) => {
  switch (action.type) {
    case ADD_MAPPING:
      return {
        ...state,
        [action.payload.id]: action.payload.type,
      };

    case ADD_MAPPINGS:
      return {
        ...state,
        ...action.payload.mapping,
      };
    default:
      return state;
  }
};
