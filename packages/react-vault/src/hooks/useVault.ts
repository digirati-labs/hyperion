import { ReactVaultContext } from '../context/VaultContext';
import { useContext } from 'react';
import { Vault } from '@hyperion-framework/vault';

export const useVault = (): Vault => {
  const { vault } = useContext(ReactVaultContext);

  if (vault === null) {
    throw new Error('Vault not found. Ensure you have your provider set up correctly.');
  }

  return vault as Vault;
};
