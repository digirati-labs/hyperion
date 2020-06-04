import { HyperionStore, NormalizedEntity } from '@hyperion-framework/types';

export function resolveIfExists<T extends NormalizedEntity>(state: HyperionStore, url: string): T | undefined {
  const request = state.hyperion.requests[url];
  // Return the resource.
  const resourceType = state.hyperion.mapping[url];
  if (!resourceType || !state.hyperion.entities[resourceType][request.resourceUri]) {
    // Continue refetching resource, this is an invalid state.
    return undefined;
  }

  return state.hyperion.entities[resourceType][request.resourceUri] as T;
}
