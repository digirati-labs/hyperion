import { MetaState } from '@hyperion-framework/types';
import { ActionType, createAction } from 'typesafe-actions';

export function getMetaFromState<T>(state: MetaState, id: string, name: string, key: string): T | undefined {
  if (!state[id] || !state[id][name] || !state[id][name][key]) {
    return undefined;
  }

  return state[id][name][key] as T;
}

export const SET_META_VALUE = '@hyperion/SET_META_VALUE';
export const SET_META_VALUE_DYNAMIC = '@hyperion/SET_META_VALUE_DYNAMIC';
export const UNSET_META_VALUE = '@hyperion/UNSET_META_VALUE';

const setMetaValue = createAction(SET_META_VALUE)<{ id: string; meta: string; key: string; value: any }>();
const setMetaValueDynamic = createAction(SET_META_VALUE_DYNAMIC)<{
  id: string;
  meta: string;
  key: string;
  updateValue: (oldValue: any) => any;
}>();
const unsetMetaValue = createAction(UNSET_META_VALUE)<{ id: string; meta: string; key: string }>();

export const metaActions = {
  setMetaValue,
  setMetaValueDynamic,
  unsetMetaValue,
};

export type MetaActions = ActionType<typeof metaActions>;

export const metaReducer = (state: MetaState = {}, action: MetaActions) => {
  const { id, updateValue, value, meta, key } = ((action && action.payload) || {}) as any;
  switch (action.type) {
    case SET_META_VALUE: {
      console.log('SET METADATA ACTION', action);
      return {
        ...state,
        [id]: {
          ...(state[id] || {}),
          [meta]: {
            ...(state[id] ? state[id][meta] || {} : {}),
            [key]: value,
          },
        },
      };
    }
    case SET_META_VALUE_DYNAMIC: {
      return {
        ...state,
        [id]: {
          ...(state[id] || {}),
          [meta]: {
            ...(state[id] ? state[id][meta] || {} : {}),
            [key]: state[id] && state[id][meta] ? updateValue(state[id][meta][key]) : updateValue(undefined),
          },
        },
      };
    }

    case UNSET_META_VALUE: {
      if (state[id] && state[id][meta] && state[id][meta][key]) {
        return {
          ...state,
          [id]: {
            ...(state[id] || {}),
            [meta]: {
              ...(state[id] ? state[id][meta] || {} : {}),
              [key]: undefined,
            },
          },
        };
      }
      return state;
    }

    default:
      return state;
  }
};
