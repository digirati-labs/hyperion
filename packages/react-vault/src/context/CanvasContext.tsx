import { ResourceProvider } from './ResourceContext';
import React from 'react';

export const CanvasContext: React.FC<{ canvas: string }> = ({ canvas, children }) => {
  return <ResourceProvider value={{ canvas }}>{children}</ResourceProvider>;
};
