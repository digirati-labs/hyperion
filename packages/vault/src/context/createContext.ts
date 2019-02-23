import { VaultState } from '../Vault';
import {CtxFunction} from "../../dist";

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
      } as { [r in N]: R };
    };
  };
}

export function emptyContext() {
  return createContext({
    name: '_empty',
    creator: () => null,
  })({});
}

export type CustomContext<N extends string, R> = <S extends VaultState, U>(state: S, util: U) => { [name in N]: R };

export type CtxFunction<S extends VaultState, U, C> = (state: S, util: U) => C;
