import { useState } from 'react';
import { useVaultEffect } from './useVaultEffect';

export const useExternalCollection = (id: string): { id: string; isLoaded: boolean } => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [realId, setRealId] = useState(id);

  useVaultEffect(
    vault => {
      vault
        .loadCollection(id)
        .then((resource) => {
          setRealId(resource.id)
          setIsLoaded(true);
        })
        .catch(err => {
          throw new Error(err);
        });
    },
    [id]
  );

  return { isLoaded, id: realId };
};
