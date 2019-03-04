import { Entities, Mapping } from './processing/normalize';

export type ImportResourcesAction = {
  type: 'IMPORT_RESOURCES';
  payload: {
    id: string;
    entities: Entities;
    mapping: Mapping;
  };
};

export function importResources(id: string, entities: Entities, mapping: Mapping): ImportResourcesAction {
  return {
    type: 'IMPORT_RESOURCES',
    payload: {
      id,
      entities,
      mapping,
    },
  };
}

export type LoadResourceAction = {
  type: 'LOAD_RESOURCE';
  payload: {
    id: string;
  };
};

export function loadResource(id: string): LoadResourceAction {
  return { type: 'LOAD_RESOURCE', payload: { id } };
}

export type AllActions = ImportResourcesAction | LoadResourceAction;
