import { useContext } from 'react';
import { ReactContext } from '../context/Context';
import { useVault } from './useVault';
import { CustomContext, VaultState } from '@hyperion-framework/vault';
import { CollectionNormalized } from '@hyperion-framework/types';

export const useCollection = <
  S extends VaultState,
  U,
  C extends { collection: CollectionNormalized }
>(): CollectionNormalized => {
  const context = useContext(ReactContext) as CustomContext<'collection', CollectionNormalized>;
  const vault = useVault();
  const { collection } = context(vault.getState(), {} as U);

  if (!collection) {
    throw new Error('useCollection should only be called from a collection context');
  }

  return collection;
};
