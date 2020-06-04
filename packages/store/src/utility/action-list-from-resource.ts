import { requestComplete, requestError, requestMismatch } from '../reducers/request';
import { TraversableEntityTypes } from '@hyperion-framework/types';
import { importEntities } from '../reducers/entities';
import { addMapping, addMappings } from '../reducers/mapping';
import { normalize } from '@hyperion-framework/parser';
import { AllActions } from '../types';

export const actionListFromResource = (id: string, response: unknown): AllActions[] => {
  const { entities, resource, mapping } = normalize(response);
  if (resource.id === undefined) {
    return [requestError({ id, message: 'ID is not defined in resource.' })] as AllActions[];
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
