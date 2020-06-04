import { ResourceProvider } from './ResourceContext';
import React from 'react';

export const AnnotationContext: React.FC<{ annotation: string }> = ({ annotation, children }) => {
  return <ResourceProvider value={{ annotation }}>{children}</ResourceProvider>;
};
