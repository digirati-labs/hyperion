import { useMemo, useState } from 'react';
import { QueryOptions, useQuery } from 'react-query';
import { useVault } from './useVault';
import { ManifestNormalized } from '@hyperion-framework/types';
import { resolveIfExists } from '@hyperion-framework/store';

export const useExternalManifest = (
  id: string,
  config: QueryOptions<ManifestNormalized, any> = {}
): { id: string; isLoaded: boolean; error: any; manifest?: ManifestNormalized } => {
  const vault = useVault();
  const [realId, setRealId] = useState(id);

  const initialData = useMemo(
    () => {
      return resolveIfExists<ManifestNormalized>(vault.getState(), id);
    },
    [id, vault]
  );

  const { data: manifest, error, isFetching } = useQuery(
    `manifest:${id}`,
    async () => {
      const fetchedManifest = initialData ? initialData : await vault.loadManifest(id);
      if (fetchedManifest && realId !== fetchedManifest.id) {
        setRealId(fetchedManifest.id);
      }
      return fetchedManifest;
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      retry: false,

      initialData,
      ...(config as any),
    }
  );

  return { isLoaded: !!manifest, id: realId, error, manifest };
};
