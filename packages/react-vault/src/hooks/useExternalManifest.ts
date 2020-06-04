import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useVault } from './useVault';
import { ManifestNormalized } from '@hyperion-framework/types';
import { resolveIfExists } from '@hyperion-framework/store';

export const useExternalManifest = (
  id: string
): { id: string; isLoaded: boolean; error: any; manifest?: ManifestNormalized } => {
  const vault = useVault();
  const [realId, setRealId] = useState(id);

  const initialData = useMemo(() => resolveIfExists<ManifestNormalized>(vault.getState(), id), [id, vault]);

  const { data: manifest, error, isFetching } = useQuery(
    `manifest:${id}`,
    async () => {
      const fetchedManifest = initialData ? initialData : await vault.loadManifest(id);
      if (fetchedManifest) {
        setRealId(fetchedManifest.id);
      }
      return fetchedManifest;
    },
    { initialData }
  );

  return { isLoaded: !isFetching, id: realId, error, manifest };
};
