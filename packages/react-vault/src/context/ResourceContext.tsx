import React, { useContext, useMemo } from 'react';

const defaultResourceContext = {
  collection: undefined,
  manifest: undefined,
  range: undefined,
  canvas: undefined,
  annotation: undefined,
};

export type ResourceContextType = {
  collection?: string;
  manifest?: string;
  range?: string;
  canvas?: string;
  annotation?: string;
};

export const ResourceReactContext = React.createContext<ResourceContextType>(defaultResourceContext);

export const useResourceContext = () => {
  return useContext(ResourceReactContext);
};

export const ResourceProvider: React.FC<{ value: ResourceContextType }> = ({ value, children }) => {
  const parentContext = useResourceContext();
  const newContext = useMemo(() => {
    return {
      ...parentContext,
      ...value,
    };
  }, [value, parentContext]);

  return <ResourceReactContext.Provider value={newContext}>{children}</ResourceReactContext.Provider>;
};
