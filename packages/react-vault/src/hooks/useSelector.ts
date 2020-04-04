import { useContext } from 'react';
import { ReactContext } from '../context/Context';
import { CtxFunction, VaultState, StateSelector } from '@hyperion-framework/vault';
import { useVault } from './useVault';

export function useSelector<S extends VaultState, C, R>(selector: StateSelector<S, C, R>) {
  const contextCreator = useContext(ReactContext) as CtxFunction<S, C>;
  const vault = useVault();

  return selector(vault.getState() as S, contextCreator, {});
}
