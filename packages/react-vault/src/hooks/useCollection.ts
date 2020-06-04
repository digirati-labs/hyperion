import { useResourceContext } from '../context/ResourceContext';
import { CollectionNormalized } from '@hyperion-framework/types';
import { useVault } from './useVault';
import { useMemo } from 'react';

export function useCollection(options: { id: string }): CollectionNormalized | undefined;
export function useCollection<T>(
  options: { id: string; selector: (collection: CollectionNormalized) => T },
  deps?: any[]
): T | undefined;
export function useCollection<T = CollectionNormalized>(
  options: {
    id?: string;
    selector?: (collection: CollectionNormalized) => T;
  },
  deps: any[] = []
): CollectionNormalized | T | undefined {
  const { id, selector } = options;
  const ctx = useResourceContext();
  const vault = useVault();
  const collectionId = id ? id : ctx.collection;

  const collection = collectionId ? vault.select(s => s.hyperion.entities.Collection[collectionId]) : undefined;

  return useMemo(
    () => {
      if (!collection) {
        return undefined;
      }
      if (selector) {
        return selector(collection);
      }
      return collection;
    },
    [collection, selector, ...deps]
  );
}
