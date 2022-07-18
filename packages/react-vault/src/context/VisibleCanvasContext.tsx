import { useContext } from 'react';
import React from 'react';
import { CanvasNormalized } from '@hyperion-framework/types';
import { useVaultSelector } from '../hooks/useVaultSelector';

export const VisibleCanvasReactContext = React.createContext<string[]>([]);

export function useVisibleCanvases(): CanvasNormalized[] {
  const ids = useContext(VisibleCanvasReactContext);

  return useVaultSelector(
    state => {
      return ids.map(id => state.hyperion.entities.Canvas[id]).filter(Boolean);
    },
    [ids]
  );
}
