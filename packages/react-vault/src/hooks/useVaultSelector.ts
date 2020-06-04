import { useVault } from './useVault';
import { HyperionStore } from '@hyperion-framework/types';
import { useMemo } from 'react';

export function useVaultSelector<T>(selector: (state: HyperionStore) => T, deps: any[] = []) {
  const vault = useVault();

  const item = vault.select(selector);

  return useMemo(
    () => {
      return item;
    },
    deps ? deps : Array.isArray(item) ? item : [item]
  );
}
