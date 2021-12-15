import { useImageService } from './useImageService';
import { ImageService } from '@hyperion-framework/types';

export function useImageTile() {
  const imageService = useImageService();

  return {
    isLoading: imageService.isFetching,
    tile: imageService.data
      ? {
          id: imageService.data.id || imageService.data['@id'],
          width: imageService.data.width,
          height: imageService.data.height,
          imageService: imageService.data as ImageService,
          thumbnail: undefined,
        }
      : null,
  };
}
