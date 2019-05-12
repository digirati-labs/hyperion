import { useContext } from 'react';
import { ReactContext } from '../context/Context';
import { useVault } from './useVault';
import { CustomContext, VaultState } from '@hyperion-framework/vault';
import { ManifestNormalized } from '@hyperion-framework/types';

export const useManifest = <
  S extends VaultState,
  U,
  C extends { manifest: ManifestNormalized }
>(): ManifestNormalized => {
  const context = useContext(ReactContext) as CustomContext<'manifest', ManifestNormalized>;
  const vault = useVault();
  const { manifest } = context(vault.getState(), {} as U);

  if (!manifest) {
    throw new Error('useManifest should only be called from a manifest context');
  }

  return manifest;
};
