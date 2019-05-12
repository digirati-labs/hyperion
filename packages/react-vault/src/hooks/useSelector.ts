import { useContext } from 'react';
import { ReactContext } from '../context/Context';
import { CtxFunction, VaultState, StateSelector } from '@hyperion-framework/vault';
import { useVault } from './useVault';

export function useSelector<S extends VaultState, U, C, R>(selector: StateSelector<S, U, C, R>) {
  const contextCreator = useContext(ReactContext) as CtxFunction<S, U, C>;
  const vault = useVault();

  return selector(vault.getState() as S, contextCreator, {} as U);
}
