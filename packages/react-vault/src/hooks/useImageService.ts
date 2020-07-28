import { usePaintingAnnotations } from './usePaintingAnnotations';
import { getImageServices } from '@atlas-viewer/iiif-image-api';
import { useCanvas } from './useCanvas';
import { useQuery } from 'react-query';
import { useVault } from './useVault';
import { ImageService } from '@hyperion-framework/types';

/**
 * Returns the First image service on the current canvas.
 */
export function useImageService(): {
  data: ImageService | undefined;
  isFetching: boolean;
  status: 'error' | 'success' | 'loading';
} {
  const canvas = useCanvas();
  const annotations = usePaintingAnnotations();
  const vault = useVault();
  const imageService = vault.getImageService();

  // @todo change this once image API updated.
  return (useQuery as any)(
    `canvas-first-image-service:${canvas ? canvas.id : 'undefined'}`,
    async () => {
      if (canvas && annotations.length) {
        const annotation = annotations[0];
        const resource = vault.fromRef<any>(annotation.body[0]);
        const imageServices = getImageServices(resource) as any[];

        return (
          (await imageService.loadService({
            id: imageServices[0].id,
            width: imageServices[0].width || canvas.width,
            height: imageServices[0].height || canvas.height,
          })) || undefined
        );
      }

      return undefined;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
      initialData: () => {
        if (canvas && annotations.length) {
          const annotation = annotations[0];
          const resource = vault.fromRef<any>(annotation.body[0]);
          const imageServices = getImageServices(resource);

          return (
            imageService.loadServiceSync({
              id: imageServices[0].id,
              width: imageServices[0].width || canvas.width,
              height: imageServices[0].height || canvas.height,
            }) || undefined
          );
        }
        return undefined;
      },
    }
  );
}
