import { StateSelector } from './createSelector';
import { VaultState } from '../Vault';

type MappedObject<K extends string, R1> = { [t in K]: R1 };

export function combineSelector<S extends VaultState, R, C1, K1 extends string, R1>(
  objs: [[K1, StateSelector<S, C1, MappedObject<K1, R1>>]]
): StateSelector<S, C1, R>;
export function combineSelector<S extends VaultState, R, K1 extends string, K2 extends string, C1, C2, R1, R2>(
  objs: [[K1, StateSelector<S, C1, R1>], [K2, StateSelector<S, C2, R2>]]
): StateSelector<S, C1 & C2, MappedObject<K1, R1> & MappedObject<K2, R2>>;
export function combineSelector<
  S extends VaultState,
  R,
  K1 extends string,
  K2 extends string,
  K3 extends string,
  C1,
  C2,
  C3,
  R1,
  R2,
  R3
>(
  objs: [[K1, StateSelector<S, C1, R1>], [K2, StateSelector<S, C2, R2>], [K3, StateSelector<S, C3, R3>]]
): StateSelector<S, C1 & C2 & C3, MappedObject<K1, R1> & MappedObject<K2, R2> & MappedObject<K3, R3>>;
export function combineSelector<
  S extends VaultState,
  R,
  K1 extends string,
  K2 extends string,
  K3 extends string,
  K4 extends string,
  C1,
  C2,
  C3,
  C4,
  R1,
  R2,
  R3,
  R4
>(
  objs: [
    [K1, StateSelector<S, C1, R1>],
    [K2, StateSelector<S, C2, R2>],
    [K3, StateSelector<S, C3, R3>],
    [K4, StateSelector<S, C4, R4>]
  ]
): StateSelector<
  S,
  C1 & C2 & C3 & C4,
  MappedObject<K1, R1> & MappedObject<K2, R2> & MappedObject<K3, R3> & MappedObject<K4, R4>
>;
export function combineSelector<S extends VaultState, R>(
  objs: Array<[keyof R, StateSelector<S, any, any>]>
): StateSelector<S, any, R> {
  return (state: S, context: any, utility: any): R => {
    const returnObject: Partial<R> = {};
    for (const [key, selector] of objs) {
      returnObject[key] = selector(state, context, utility);
    }
    return returnObject as R;
  };
}
