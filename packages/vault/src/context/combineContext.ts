import { VaultState } from '../Vault';
import { CtxFunction } from './createContext';

export function combineContext<S extends VaultState, ContextA>(): {};
export function combineContext<S extends VaultState, ContextA>(a: CtxFunction<S, ContextA>): ContextA;
export function combineContext<S extends VaultState, ContextA, ContextB>(
  a: CtxFunction<S, ContextA>,
  b: CtxFunction<S, ContextB>
): CtxFunction<S, ContextA & ContextB>;
export function combineContext<S extends VaultState, ContextA, ContextB, ContextC>(
  a: CtxFunction<S, ContextA>,
  b: CtxFunction<S, ContextB>,
  c: CtxFunction<S, ContextC>
): CtxFunction<S, ContextA & ContextB & ContextC>;
export function combineContext<S extends VaultState, ContextA, ContextB, ContextC, ContextD>(
  a: CtxFunction<S, ContextA>,
  b: CtxFunction<S, ContextB>,
  c: CtxFunction<S, ContextC>,
  d: CtxFunction<S, ContextD>
): CtxFunction<S, ContextA & ContextB & ContextC & ContextD>;
export function combineContext<S extends VaultState, ContextA, ContextB, ContextC, ContextD, ContextE>(
  a: CtxFunction<S, ContextA>,
  b: CtxFunction<S, ContextB>,
  c: CtxFunction<S, ContextC>,
  d: CtxFunction<S, ContextD>,
  e: CtxFunction<S, ContextE>
): CtxFunction<S, ContextA & ContextB & ContextC & ContextD & ContextE>;
export function combineContext<S extends VaultState, ContextA, ContextB, ContextC, ContextD, ContextE, ContextF>(
  a: CtxFunction<S, ContextA>,
  b: CtxFunction<S, ContextB>,
  c: CtxFunction<S, ContextC>,
  d: CtxFunction<S, ContextD>,
  e: CtxFunction<S, ContextE>,
  f: CtxFunction<S, ContextF>
): CtxFunction<S, ContextA & ContextB & ContextC & ContextD & ContextE & ContextF>;
export function combineContext<S extends VaultState>(...context: any[]): any {
  return (state: S, util: any) => {
    return context.reduce((all, ctx) => {
      return { ...all, ...ctx(state, util) };
    }, {});
  };
}
