import { ContentResource } from '@hyperion-framework/types';

/**
 * Parse specific resource.
 *
 * This could be expanded to support pulling out more from the specific resource.
 *
 * @param resource
 */
export function parseSpecificResource(resource: ContentResource) {
  if (resource.type === 'SpecificResource') {
    return [resource.source, { selector: resource.selector }];
  }

  return [resource, { selector: null }];
}
