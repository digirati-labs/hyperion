import { fromContentResource } from '../factory/content-resource';
import { fromImageService } from '../factory/image-service';
import { CompositeResource } from './composite-resource';
import { SpacialContent } from './spacial-content';
import { IIIFExternalWebResource, Service } from '@hyperion-framework/types';
import { SingleImage } from './single-image';

export class ImageService extends CompositeResource implements SpacialContent {
  static fromImageService(
    service: Service,
    target?: { width?: number; height?: number }
  ): ImageService | SingleImage | null {
    return fromImageService(service, target);
  }

  static fromContentResource(contentResource: IIIFExternalWebResource | string): Array<ImageService | SingleImage> {
    return fromContentResource(contentResource);
  }
}
