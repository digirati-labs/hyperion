import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useVault } from './useVault';
import { CollectionNormalized } from '@hyperion-framework/types';
import { resolveIfExists } from '@hyperion-framework/store';

export const useExternalCollection = (
  id: string
): { id: string; isLoaded: boolean; collection?: CollectionNormalized } => {
  const vault = useVault();
  const [realId, setRealId] = useState(id);

  const initialData = useMemo(() => resolveIfExists<CollectionNormalized>(vault.getState(), id), [id, vault]);

  const { data: collection, isFetching } = useQuery(
    `collection:${id}`,
    async () => {
      const fetchedCollection = initialData ? initialData : await vault.loadCollection(id);
      if (fetchedCollection) {
        setRealId(fetchedCollection.id);
      }
      return fetchedCollection;
    },
    { initialData }
  );

  return { isLoaded: !isFetching, id: realId, collection };
};
