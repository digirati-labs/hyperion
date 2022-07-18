import { TraversableEntityTypes, TraversableEntityMap } from '@hyperion-framework/types';
import { resolveList } from '@hyperion-framework/store';
import { useVaultSelector } from './useVaultSelector';

export function useResources<Type extends TraversableEntityTypes>(
  ids: string[],
  type: Type
): TraversableEntityMap[Type][] {
  return useVaultSelector(
    state =>
      resolveList(
        state,
        ids.map(id => ({ id, type }))
      ) as any,
    [ids, type]
  );
}
