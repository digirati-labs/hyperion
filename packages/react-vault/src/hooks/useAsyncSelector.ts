import { useContext, useEffect, useRef, useState } from 'react';
import { ReactContext } from '../context/Context';
import { CtxFunction, VaultState, StateSelector } from '@hyperion-framework/vault';
import { useVault } from './useVault';

export function useAsyncSelector<S extends VaultState, U, C, R>(selector: StateSelector<S, C, R>, deps: any[] = []) {
  const contextCreator = useContext(ReactContext) as CtxFunction<S, C>;
  const [isLoaded, setIsLoaded] = useState<boolean>();
  const [value, setCurrentValue] = useState<R>();
  const ref = useRef(Symbol('none'));
  const vault = useVault();

  useEffect(() => {
    setIsLoaded(false);
    const result = Promise.resolve(selector(vault.getState() as S, contextCreator, {} as U));
    const identity = Symbol();
    ref.current = identity;
    result.then(newValue => {
      setIsLoaded(true);
      if (ref.current === identity) {
        if (newValue !== value) {
          setCurrentValue(newValue);
        }
      }
    });
  }, deps);

  if (!isLoaded) {
    return [
      isLoaded,
      null,
      value,
    ];
  }

  return [
    isLoaded,
    value,
    null,
  ];
}
