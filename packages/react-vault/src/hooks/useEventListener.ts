import { Reference, TraversableEntityTypes } from '@hyperion-framework/types';
import { useVault } from './useVault';
import { useEffect } from 'react';

type SupportedEvents = 'onClick';

export function useEventListener<T>(
  resource: Reference<TraversableEntityTypes>,
  name: SupportedEvents,
  listener: (e: any, resource: T) => void,
  scope?: string[],
  deps: any[] = []
) {
  const vault = useVault();
  useEffect(() => {
    const currentResource = resource;
    if (!currentResource) {
      return () => {
        //
      };
    }
    vault.addEventListener(currentResource, name, listener, scope);
    return () => {
      vault.removeEventListener(currentResource, name, listener);
    };
  }, [vault, resource, name, ...deps]);
}
