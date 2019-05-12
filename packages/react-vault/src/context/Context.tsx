import React, { Context as ReactCtx, useContext, useMemo } from 'react';
import { emptyContext, combineContext, CtxFunction, VaultState } from '@hyperion-framework/vault';

export const ReactContext = React.createContext<unknown>(emptyContext);

export function Context<S extends VaultState, U, C1, C2>({
  children,
  context,
}: {
  children: React.ReactNode;
  context: CtxFunction<S, U, C1>;
}) {
  const parentContext = useContext(ReactContext as ReactCtx<CtxFunction<S, U, C2>>);

  const vaultContext = useMemo(() => (parentContext ? combineContext(parentContext, context) : context), [
    context,
    parentContext,
  ]);

  return useMemo(
    () => {
      return <ReactContext.Provider value={vaultContext}>{children}</ReactContext.Provider>;
    },
    [vaultContext, children]
  );
}
