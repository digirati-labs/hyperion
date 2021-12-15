import { NormalizedEntity, Reference, TraversableEntityTypes } from '@hyperion-framework/types';
import { useVault } from './useVault';
import { useVaultSelector } from './useVaultSelector';
import { useMemo } from 'react';

export function useResourceEvents<T extends NormalizedEntity>(
  resource?: Reference<TraversableEntityTypes>,
  scope?: string
) {
  const vault = useVault();
  const hooks = useVaultSelector(() => {
    if (resource && resource.id) {
      return vault.getResourceMeta(resource.id, 'eventManager');
    }
    return null;
  }, [resource]);

  return useMemo(() => {
    const props: any = {};
    if (hooks && resource) {
      for (const hook of Object.keys(hooks)) {
        props[hook] = (e: any) => {
          const fullResource = vault.fromRef(resource);
          for (const { callback, scope: _scope } of hooks[hook] || []) {
            if (!_scope || (scope && _scope.indexOf(scope) !== -1)) {
              callback(e, fullResource);
            }
          }
        };
      }
    }
    return props;
  }, [hooks, resource, vault, scope]);
}
