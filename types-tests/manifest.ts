// TypeScript Version: 2.8

import { Manifest, ManifestNormalized } from '@hyperion-framework/types';

function cast<T>(m: T): T {
  return m;
}

// typings:expect-error
cast<Manifest>({});

// typings:expect-error
cast<Manifest>({});

cast<Manifest>({
  id: '...',
  type: 'Manifest',
  items: [],
  label: { en: ['testing label'] },
});

// typings:expect-error
cast<ManifestNormalized>({});
