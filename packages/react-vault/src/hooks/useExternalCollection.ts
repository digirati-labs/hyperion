import {useState} from "react";
import {useVaultEffect} from "./useVaultEffect";

export const useExternalCollection = (id: string): { id: string; isLoaded: boolean } => {
  const [isLoaded, setIsLoaded] = useState(false);

  useVaultEffect(
    vault => {
      vault
        .loadCollection(id)
        .then(() => {
          setIsLoaded(true);
        })
        .catch(err => {
          throw new Error(err);
        });
    },
    [id]
  );

  return { isLoaded, id };
};
