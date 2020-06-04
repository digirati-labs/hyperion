import {
  HyperionStore,
  Reference,
  TraversableEntityMappedType,
  TraversableEntityTypes,
} from '@hyperion-framework/types';

export function resolveList<T extends TraversableEntityTypes = TraversableEntityTypes>(
  state: HyperionStore,
  items: Reference<T>[]
): Array<TraversableEntityMappedType<T>> {
  const returnItems = [];
  for (const ref of items) {
    if (state.hyperion.entities[ref.type] && state.hyperion.entities[ref.type][ref.id]) {
      returnItems.push(state.hyperion.entities[ref.type][ref.id]);
    }
  }
  return returnItems as any[];
}
