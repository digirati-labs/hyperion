import { useVaultSelector } from './useVaultSelector';
import { HyperionStore } from '@hyperion-framework/types';
import { Meta } from '@hyperion-framework/vault';

function getMeta(state: HyperionStore, resourceId: string) {
  const resourceMeta = state?.hyperion?.meta[resourceId];
  if (!resourceMeta) {
    return null;
  }
  return resourceMeta.annotationPageManager as Meta['annotationPageManager'];
}

export function useEnabledAnnotationPageIds(resourceId?: string, availablePageIds?: string[]) {
  return useVaultSelector(
    state => {
      const pageIds: string[] = [];
      if (!resourceId) {
        return pageIds;
      }
      const allAnnotationListIds = Object.keys(state.hyperion.entities.AnnotationPage);
      for (const annotationListId of allAnnotationListIds) {
        if (!availablePageIds || availablePageIds.indexOf(annotationListId) !== -1) {
          const annotationListMeta = getMeta(state, annotationListId);
          if (annotationListMeta && annotationListMeta.views && annotationListMeta.views[resourceId]) {
            pageIds.push(annotationListId);
          }
        }
      }

      return pageIds;
    },
    [resourceId]
  );
}
