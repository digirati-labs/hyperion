import { IIIFExternalWebResource } from '@hyperion-framework/types';
import { isImageService } from '@hyperion-framework/vault';
import { ImageService, SingleImage } from '../spacial-content';
import { fromImageService } from './image-service';

export function fromContentResource(
  contentResource: IIIFExternalWebResource | string
): Array<ImageService | SingleImage> {
  if (typeof contentResource === 'string' || contentResource.type !== 'Image') {
    // @todo could do more?
    return [];
  }

  const services = contentResource!.service || [];
  // Filter image services.
  const imageServices = services.filter(service => isImageService(service));

  const tiles = imageServices
    .map(service => fromImageService(service, contentResource as IIIFExternalWebResource))
    .filter(r => r !== null) as ImageService[];

  if (tiles.length) {
    return tiles;
  }

  if (contentResource.id && contentResource!.width && contentResource!.height) {
    return [
      SingleImage.fromImage(contentResource.id, {
        width: contentResource.width as number,
        height: contentResource.height as number,
      }),
    ];
  }
  return [];
}
