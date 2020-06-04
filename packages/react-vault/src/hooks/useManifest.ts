import { useResourceContext } from '../context/ResourceContext';
import { ManifestNormalized } from '@hyperion-framework/types';
import { useVault } from './useVault';
import { useMemo } from 'react';

export function useManifest(options?: { id: string }): ManifestNormalized | undefined;
export function useManifest<T>(
  options?: { id: string; selector: (manifest: ManifestNormalized) => T },
  deps?: any[]
): T | undefined;
export function useManifest<T = ManifestNormalized>(
  options: {
    id?: string;
    selector?: (manifest: ManifestNormalized) => T;
  } = {},
  deps: any[] = []
): ManifestNormalized | T | undefined {
  const { id, selector } = options;
  const ctx = useResourceContext();
  const vault = useVault();
  const manifestId = id ? id : ctx.manifest;

  const manifest = manifestId ? vault.select(s => s.hyperion.entities.Manifest[manifestId]) : undefined;

  return useMemo(
    () => {
      if (!manifest) {
        return undefined;
      }
      if (selector) {
        return selector(manifest);
      }
      return manifest;
    },
    [manifest, selector, ...deps]
  );
}
