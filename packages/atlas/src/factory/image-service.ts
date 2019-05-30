import { Service } from '@hyperion-framework/types';
import { ImageService, SingleImage, TiledImage } from '../spacial-content';

export function fromImageService(
  service: Service,
  target?: { width?: number; height?: number }
): ImageService | SingleImage | null {
  const width = service.width || target!.width;
  const height = service.height || target!.height;

  if (typeof width === 'undefined' || typeof height === 'undefined') {
    throw new Error('Image service has no width/height and no target, one is required');
  }

  if (service.tiles) {
    // level 1 / 2
    return new ImageService({
      id: service.id,
      width: width,
      height: height,
      images: service.tiles.reduce((acc: TiledImage[], tile) => {
        return tile.scaleFactors.reduce((innerAcc: TiledImage[], size) => {
          innerAcc.push(
            TiledImage.fromTile(
              service.id,
              {
                width: width,
                height: height,
              },
              tile,
              size
            )
          );
          return acc;
        }, acc);
      }, []),
    });
  }

  if (service.sizes) {
    // level 0
  }

  // @todo make this.
  return null;
}
