// This works inside of a manifest context
// Final API to be decided, but this hook will be for driving search querying itself
// Another hook/context will handle actually getting the search results for a particular canvas
import { useManifest } from './useManifest';
import { SearchService, ServiceNormalized } from '@hyperion-framework/types';

export function useSearchService(): SearchService | undefined {
  const manifest = useManifest();
  return manifest
    ? (manifest.service.find(
        (service: ServiceNormalized) =>
          service.profile === 'SearchService1' || service.profile === 'http://iiif.io/api/search/1/search'
      ) as any)
    : undefined;
}
