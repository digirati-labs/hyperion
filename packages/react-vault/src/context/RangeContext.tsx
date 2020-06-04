import { ResourceProvider } from './ResourceContext';
import React from 'react';

export const RangeContext: React.FC<{ range: string }> = ({ range, children }) => {
  return <ResourceProvider value={{ range }}>{children}</ResourceProvider>;
};
