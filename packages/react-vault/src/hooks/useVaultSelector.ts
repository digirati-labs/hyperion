import { useVault } from './useVault';
import { HyperionStore } from '@hyperion-framework/types';
import { useEffect, useState } from 'react';

export function useVaultSelector<T>(selector: (state: HyperionStore) => T, deps: any[] = []) {
  const vault = useVault();
  const [selectedState, setSelectedState] = useState<T>(() => selector(vault.getState()));

  useEffect(() => {
    return vault.subscribe(selector, state => {
      setSelectedState(state);
    });
  }, deps);

  return selectedState as T;
}
