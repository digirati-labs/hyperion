import { Vault } from '@hyperion-framework/vault';
import { useVault } from './useVault';
import { useEffect } from 'react';

export const useVaultEffect = (callback: (vault: Vault) => void, deps: any[] = []): void => {
  const vault = useVault();

  useEffect(
    () => {
      callback(vault);
    },
    [vault, ...deps]
  );
};
