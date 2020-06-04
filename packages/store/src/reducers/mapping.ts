import produce from 'immer';
import { ActionType, createAction } from 'typesafe-actions';
import { EntityMapping, TraversableEntityTypes } from '@hyperion-framework/types';

export const ADD_MAPPING = '@hyperion/ADD_MAPPING';
export const ADD_MAPPINGS = '@hyperion/ADD_MAPPINGS';

export const addMapping = createAction(ADD_MAPPING)<{ id: string; type: TraversableEntityTypes }>();
export const addMappings = createAction(ADD_MAPPINGS)<{ mapping: { [id: string]: TraversableEntityTypes } }>();

export const mappingActions = { addMapping, addMappings };

export type MappingActions = ActionType<typeof mappingActions>;

export const mappingReducer = (state: EntityMapping = {}, action: ActionType<typeof mappingActions> | any) =>
  produce(state, (draft: EntityMapping) => {
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
