// This is valid under a range context.
import { useResourceContext } from '../context/ResourceContext';
import { RangeNormalized } from '@hyperion-framework/types';
import { useVault } from './useVault';
import { useMemo } from 'react';

export function useRange(options?: { id: string }): RangeNormalized | undefined;
export function useRange<T>(
  options?: { id: string; selector: (range: RangeNormalized) => T },
  deps?: any[]
): T | undefined;
export function useRange<T = RangeNormalized>(
  options: {
    id?: string;
    selector?: (range: RangeNormalized) => T;
  } = {},
  deps: any[] = []
): RangeNormalized | T | undefined {
  const { id, selector } = options;
  const ctx = useResourceContext();
  const vault = useVault();
  const rangeId = id ? id : ctx.range;

  const range = rangeId ? vault.select(s => s.hyperion.entities.Range[rangeId]) : undefined;

  return useMemo(
    () => {
      if (!range) {
        return undefined;
      }
      if (selector) {
        return selector(range);
      }
      return range;
    },
    [range, selector, ...deps]
  );
}
