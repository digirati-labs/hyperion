// TypeScript Version: 2.8

import { Collection, CollectionNormalized } from '@hyperion-framework/types';

function cast<T>(m: T): T {
  return m;
}

// typings: expect-error
cast<Collection>({});

cast<Collection>({
  id: '...',
  type: 'Collection',
  items: [],
  label: { en: ['testing label'] },
});

cast<CollectionNormalized>({
  id: '...',
  type: 'Collection',
  items: [],
  label: { en: ['testing label'] },
});
