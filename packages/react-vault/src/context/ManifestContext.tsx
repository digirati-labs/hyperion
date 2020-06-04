import { ResourceProvider } from './ResourceContext';
import React from 'react';

export const ManifestContext: React.FC<{ manifest: string }> = ({ manifest, children }) => {
  return <ResourceProvider value={{ manifest }}>{children}</ResourceProvider>;
};
