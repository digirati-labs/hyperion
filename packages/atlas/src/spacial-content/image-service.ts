import { SpacialContent } from './spacial-content';
import { compose, DnaFactory, translate } from '../dna';
import { IIIFExternalWebResource, Service } from '@hyperion-framework/types';
import { DisplayData } from '../types';
import { Paint } from '../world-objects';
import { isImageService } from '@hyperion-framework/vault/lib/selectors/getImageService';
import { SingleImage } from './single-image';
import { TiledImage } from './tiled-image';
import { bestResourceAtRatio } from '../utils';
import { AbstractContent } from './abstract-content';

export class ImageService<T extends SpacialContent = SpacialContent> extends AbstractContent implements SpacialContent {
  readonly id: string;
  readonly display: DisplayData;
  points: Float32Array;
  images: T[];
  scaleFactors: number[];

  aggregateBuffer = new Float32Array(9);

  // isImageServiceDirty = false;

  // set isDirty(value: boolean) {
  //   this.isImageServiceDirty = value;
  //   const len = this.images.length;
  //   for (let i = 0; i < len; i++) {
  //     this.images[i].isDirty = value;
  //   }
  // }
  //
  // get isDirty(): boolean {
  //   if (this.isImageServiceDirty) {
  //     return true;
  //   }
  //   const len = this.images.length;
  //   for (let i = 0; i < len; i++) {
  //     if (this.images[i].isDirty) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  constructor(data: { id: string; width: number; height: number; images: T[] }) {
    super();
    this.id = data.id;
    this.points = DnaFactory.singleBox(data.width, data.height);

    this.display = {
      points: DnaFactory.singleBox(data.width, data.height),
      height: data.height,
      width: data.width,
      scale: 1,
    };

    this.images = data.images.sort((a: T, b: T) => b.display.width - a.display.width);
    this.scaleFactors = this.images.map(singleImage => singleImage.display.scale);
  }

  static fromImageService(
    service: Service,
    target?: { width?: number; height?: number }
  ): ImageService<SpacialContent> | SingleImage | null {
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

  static fromContentResource(
    contentResource: IIIFExternalWebResource | string
  ): Array<ImageService<SpacialContent> | SingleImage> {
    if (typeof contentResource === 'string' || contentResource.type !== 'Image') {
      // @todo could do more?
      return [];
    }

    const services = contentResource!.service || [];
    // Filter image services.
    const imageServices = services.filter(service => isImageService(service));

    const tiles = imageServices
      .map(service => ImageService.fromImageService(service, contentResource as IIIFExternalWebResource))
      .filter(r => r !== null) as Array<ImageService<SpacialContent>>;

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

  getPointsAt(target: Float32Array, aggregate?: Float32Array, scale?: number): Paint {
    return bestResourceAtRatio(1 / (scale || 1), this.images).getPointsAt(
      target,
      aggregate
        ? compose(
            aggregate,
            translate(this.x, this.y),
            this.aggregateBuffer
          )
        : translate(this.x, this.y),
      scale
    );
  }
}
