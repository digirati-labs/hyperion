import { VaultState } from '../Vault';

export type createContextArgs<N extends string, T, C, R> = {
  name: N;
  // Called once on creation (an identity)
  creator: (arg: T) => C;
  // Called each time when passed to selectors.
  resolve?: <S extends VaultState, U>(ref: C, state: S, util: U) => R;
};

export type createContextReturn<N extends string, T, C, R> = (arg: T) => CustomContext<N, R>;

export function createContext<N extends string, T, C, R = C>({
  name,
  creator,
  resolve = (r: unknown) => r as R,
}: createContextArgs<N, T, C, R>): createContextReturn<N, T, C, R> {
  return (arg: T) => {
    const ref: C = creator(arg);
    return <S extends VaultState, U>(state: S, util: U) => {
      return {
        [name]: resolve ? resolve<S, U>(ref, state, util) : ref,
      } as { [name in N]: R };
    };
  };
}

export type CustomContext<N extends string, R> = <S extends VaultState, U>(state: S, util: U) => { [name in N]: R };

export type CtxFunction<S extends VaultState, U, C> = (state: S, util: U) => C;

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
