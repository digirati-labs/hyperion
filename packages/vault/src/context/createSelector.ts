import { VaultState } from '../Vault';
import { CtxFunction } from './createContext';

export function createSelector<S extends VaultState, U, R, ContextA, ContextB, ContextC, ContextD>({
  context,
  selector,
}: {
  context?: [
    (arg: any) => CtxFunction<S, U, ContextA>,
    (arg: any) => CtxFunction<S, U, ContextB>,
    (arg: any) => CtxFunction<S, U, ContextC>,
    (arg: any) => CtxFunction<S, U, ContextD>
  ];
  selector: (state: S, ctx: ContextA & ContextB & ContextC & ContextD, util: U) => R;
}): (state: S, context: CtxFunction<S, U, ContextA & ContextB & ContextC & ContextD>, util: U) => R;

export function createSelector<S extends VaultState, U, R, ContextA, ContextB, ContextC>({
  context,
  selector,
}: {
  context?: [
    (arg: any) => CtxFunction<S, U, ContextA>,
    (arg: any) => CtxFunction<S, U, ContextB>,
    (arg: any) => CtxFunction<S, U, ContextC>
  ];
  selector: (state: S, ctx: ContextA & ContextB & ContextC, util: U) => R;
}): (state: S, context: CtxFunction<S, U, ContextA & ContextB & ContextC>, util: U) => R;

export function createSelector<S extends VaultState, U, R, ContextA, ContextB>({
  context,
  selector,
}: {
  context?: [(arg: any) => CtxFunction<S, U, ContextA>, (arg: any) => CtxFunction<S, U, ContextB>];
  selector: (state: S, ctx: ContextA & ContextB, util: U) => R;
}): (state: S, context: CtxFunction<S, U, ContextA & ContextB>, util: U) => R;

export function createSelector<S extends VaultState, U, R, ContextA>({
  context,
  selector,
}: {
  context?: [(arg: any) => CtxFunction<S, U, ContextA>];
  selector: (state: S, ctx: ContextA, util: U) => R;
}): (state: S, context: CtxFunction<S, U, ContextA>, util: U) => R;

export function createSelector<S extends VaultState, U, R>({
  context,
  selector,
}: {
  context?: Array<(...args: any[]) => any>;
  selector: (state: S, ctx: any, util: U) => R;
}) {
  return (state: S, innerContext: CtxFunction<S, U, R>, util: U) => selector(state, innerContext(state, util), util);
}
