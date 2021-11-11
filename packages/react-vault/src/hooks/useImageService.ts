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
  return useQuery(
    `canvas-first-image-service:${canvas ? canvas.id : 'undefined'}`,
    async () => {
      if (canvas && annotations.length) {
        const annotation = annotations[0];
        const resource = vault.fromRef<any>(annotation.body[0]);
        const imageServices = getImageServices(resource) as any[];
        const firstImageService = imageServices[0] as any;

        if (!firstImageService) {
          return undefined;
        }

        return (
          (await imageService.loadService({
            id: firstImageService.id || firstImageService['@id'],
            width: firstImageService.width || canvas.width,
            height: firstImageService.height || canvas.height,
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
          const firstImageService = imageServices[0];

          if (!firstImageService) {
            return undefined;
          }

          return (
            imageService.loadServiceSync({
              id: firstImageService.id || (firstImageService['@id'] as string),
              width: firstImageService.width || canvas.width,
              height: firstImageService.height || canvas.height,
            }) || undefined
          );
        }
        return undefined;
      },
    }
  );
}
