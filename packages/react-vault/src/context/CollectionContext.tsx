import { ResourceProvider } from './ResourceContext';
import React from 'react';

export const CollectionContext: React.FC<{ collection: string }> = ({ collection, children }) => {
  return <ResourceProvider value={{ collection }}>{children}</ResourceProvider>;
};
