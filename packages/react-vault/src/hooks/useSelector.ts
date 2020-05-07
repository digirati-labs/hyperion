import { useContext, useState } from 'react';
import { ReactContext } from '../context/Context';
import { CtxFunction, VaultState, StateSelector } from '@hyperion-framework/vault';
import { useVault } from './useVault';
import { useVaultEffect } from './useVaultEffect';

export function useSelector<S extends VaultState, C, R>(selector: StateSelector<S, C, R>) {
  const contextCreator = useContext(ReactContext) as CtxFunction<S, C>;
  const v = useVault();
  const [state, setState] = useState(() => selector(v.getState() as S, contextCreator, {}));

  useVaultEffect(
    vault => {
      return vault.subscribe(selector, contextCreator, s => {
        setState(s as any);
      });
    },
    [contextCreator]
  );

  return state;
}
