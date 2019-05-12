import { useContext } from 'react';
import { ReactContext } from '../context/Context';
import { useVault } from './useVault';
import { CustomContext, VaultState } from '@hyperion-framework/vault';
import { CanvasNormalized } from '@hyperion-framework/types';

export const useCanvas = <
  S extends VaultState,
  U,
  C extends { canvas: CanvasNormalized }
  >(): CanvasNormalized => {
  const context = useContext(ReactContext) as CustomContext<'canvas', CanvasNormalized>;
  const vault = useVault();
  const { canvas } = context(vault.getState(), {} as U);

  if (typeof canvas === 'undefined') {
    throw new Error('useCanvas should only be called from a canvas context');
  }

  return canvas;
};
