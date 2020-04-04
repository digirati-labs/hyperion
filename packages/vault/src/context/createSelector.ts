import { VaultState } from '../Vault';
import { CtxFunction } from './createContext';

export type StateSelector<S extends VaultState, Ctx, R> = (state: S, context: CtxFunction<S, Ctx>, util: any) => R;

type UnknownFields = { [t: string]: any };

export function createSelector<S extends VaultState, R, ContextA, ContextB, ContextC, ContextD>({
  context,
  selector,
}: {
  context?: [
    (arg: any) => CtxFunction<S, ContextA>,
    (arg: any) => CtxFunction<S, ContextB>,
    (arg: any) => CtxFunction<S, ContextC>,
    (arg: any) => CtxFunction<S, ContextD>
  ];
  selector: (state: S, ctx: ContextA & ContextB & ContextC & ContextD & UnknownFields, util: any) => R;
}): StateSelector<S, ContextA & ContextB & ContextC & ContextD & UnknownFields, R>;

export function createSelector<S extends VaultState, R, ContextA, ContextB, ContextC>({
  context,
  selector,
}: {
  context?: [
    (arg: any) => CtxFunction<S, ContextA>,
    (arg: any) => CtxFunction<S, ContextB>,
    (arg: any) => CtxFunction<S, ContextC>
  ];
  selector: (state: S, ctx: ContextA & ContextB & ContextC & UnknownFields, util: any) => R;
}): StateSelector<S, ContextA & ContextB & ContextC & UnknownFields, R>;

export function createSelector<S extends VaultState, R, ContextA, ContextB>({
  context,
  selector,
}: {
  context?: [(arg: any) => CtxFunction<S, ContextA>, (arg: any) => CtxFunction<S, ContextB>];
  selector: (state: S, ctx: ContextA & ContextB & UnknownFields, util: any) => R;
}): StateSelector<S, ContextA & ContextB & UnknownFields, R>;

export function createSelector<S extends VaultState, R, ContextA>({
  context,
  selector,
}: {
  context?: [(arg: any) => CtxFunction<S, ContextA>];
  selector: (state: S, ctx: ContextA & UnknownFields, util: any) => R;
}): StateSelector<S, ContextA & UnknownFields, R>;

export function createSelector<S extends VaultState, R>({
  context,
  selector,
}: {
  context?: Array<(...args: any[]) => any>;
  selector: (state: S, ctx: any, util: any) => R;
}) {
  return (state: S, innerContext: CtxFunction<S, R>, util: any) => selector(state, innerContext(state, util), util);
}
