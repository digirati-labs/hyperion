import { useContext } from 'react';
import { ManifestReactContext } from '../context/ManifestContext';
import { useVault } from './useVault';
import { VaultState } from '@hyperion-framework/vault';

// This is valid under a manifest context.
export const useManifest = <S extends VaultState, U, C, R>(selector: any = null) => {
  // THIS IS NOT FINAL, PROOF OF CONCEPT.
  const vault = useVault();
  const context = useContext(ManifestReactContext);

  const { manifest } = context(vault.getState(), vault);

  if (selector) {
    return selector(vault.getState() as S, context, {});
  }

  return manifest;
};
