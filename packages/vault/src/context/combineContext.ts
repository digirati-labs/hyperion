import { VaultState } from '../Vault';
import { CtxFunction } from './createContext';

export function combineContext<S extends VaultState, U, ContextA>(): {};
export function combineContext<S extends VaultState, U, ContextA>(a: CtxFunction<S, U, ContextA>): ContextA;
export function combineContext<S extends VaultState, U, ContextA, ContextB>(
  a: CtxFunction<S, U, ContextA>,
  b: CtxFunction<S, U, ContextB>
): CtxFunction<S, U, ContextA & ContextB>;
export function combineContext<S extends VaultState, U, ContextA, ContextB, ContextC>(
  a: CtxFunction<S, U, ContextA>,
  b: CtxFunction<S, U, ContextB>,
  c: CtxFunction<S, U, ContextC>
): CtxFunction<S, U, ContextA & ContextB & ContextC>;
export function combineContext<S extends VaultState, U, ContextA, ContextB, ContextC, ContextD>(
  a: CtxFunction<S, U, ContextA>,
  b: CtxFunction<S, U, ContextB>,
  c: CtxFunction<S, U, ContextC>,
  d: CtxFunction<S, U, ContextD>
): CtxFunction<S, U, ContextA & ContextB & ContextC & ContextD>;
export function combineContext<S extends VaultState, U, ContextA, ContextB, ContextC, ContextD, ContextE>(
  a: CtxFunction<S, U, ContextA>,
  b: CtxFunction<S, U, ContextB>,
  c: CtxFunction<S, U, ContextC>,
  d: CtxFunction<S, U, ContextD>,
  e: CtxFunction<S, U, ContextE>
): CtxFunction<S, U, ContextA & ContextB & ContextC & ContextD & ContextE>;
export function combineContext<S extends VaultState, U, ContextA, ContextB, ContextC, ContextD, ContextE, ContextF>(
  a: CtxFunction<S, U, ContextA>,
  b: CtxFunction<S, U, ContextB>,
  c: CtxFunction<S, U, ContextC>,
  d: CtxFunction<S, U, ContextD>,
  e: CtxFunction<S, U, ContextE>,
  f: CtxFunction<S, U, ContextF>
): CtxFunction<S, U, ContextA & ContextB & ContextC & ContextD & ContextE & ContextF>;
export function combineContext<S extends VaultState, U>(...context: any[]): any {
  return (state: S, util: U) => {
    return context.reduce((all, ctx) => {
      return { ...all, ...ctx(state, util) };
    }, {});
  };
}
