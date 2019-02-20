import { VaultState } from '../Vault';
import { CtxFunction } from './createContext';

export type StateSelector<S extends VaultState, U, Ctx, R> = (state: S, context: CtxFunction<S, U, Ctx>, util: U) => R;

type UnknownFields = { [t: string]: any };

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
  selector: (state: S, ctx: ContextA & ContextB & ContextC & ContextD & UnknownFields, util: U) => R;
}): StateSelector<S, U, ContextA & ContextB & ContextC & ContextD & UnknownFields, R>;

export function createSelector<S extends VaultState, U, R, ContextA, ContextB, ContextC>({
  context,
  selector,
}: {
  context?: [
    (arg: any) => CtxFunction<S, U, ContextA>,
    (arg: any) => CtxFunction<S, U, ContextB>,
    (arg: any) => CtxFunction<S, U, ContextC>
  ];
  selector: (state: S, ctx: ContextA & ContextB & ContextC & UnknownFields, util: U) => R;
}): StateSelector<S, U, ContextA & ContextB & ContextC & UnknownFields, R>;

export function createSelector<S extends VaultState, U, R, ContextA, ContextB>({
  context,
  selector,
}: {
  context?: [(arg: any) => CtxFunction<S, U, ContextA>, (arg: any) => CtxFunction<S, U, ContextB>];
  selector: (state: S, ctx: ContextA & ContextB & UnknownFields, util: U) => R;
}): StateSelector<S, U, ContextA & ContextB & UnknownFields, R>;

export function createSelector<S extends VaultState, U, R, ContextA>({
  context,
  selector,
}: {
  context?: [(arg: any) => CtxFunction<S, U, ContextA>];
  selector: (state: S, ctx: ContextA & UnknownFields, util: U) => R;
}): StateSelector<S, U, ContextA & UnknownFields, R>;

export function createSelector<S extends VaultState, U, R>({
  context,
  selector,
}: {
  context?: Array<(...args: any[]) => any>;
  selector: (state: S, ctx: any, util: U) => R;
}) {
  return (state: S, innerContext: CtxFunction<S, U, R>, util: U) => selector(state, innerContext(state, util), util);
}
