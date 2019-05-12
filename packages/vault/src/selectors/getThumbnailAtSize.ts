import { createSelector } from '../context/createSelector';
import { createContext } from '../context/createContext';
import {canvasContext, manifestContext, VaultState} from '..';
import {
  CanvasNormalized,
  ContentResource,
  IIIFExternalWebResource,
  ManifestNormalized,
  Service
} from '@hyperion-framework/types';

export type thumbnailSizeConfig = {
  height: number;
  width: number;
  maxWidth: number;
  minWidth: number;
  maxHeight: number;
  minHeight: number;
  maxScale: number;
  virtualThumbnailFromImageService: boolean;
  allowOversizing: boolean;
  atAnyCost: boolean;
};

export const defaultThumbnailSizeConfig: thumbnailSizeConfig = {
  height: 250,
  width: 250,
  maxWidth: Infinity,
  minWidth: 50,
  maxHeight: Infinity,
  minHeight: 50,
  maxScale: Infinity,
  // Future options
  virtualThumbnailFromImageService: false,
  allowOversizing: true,
  atAnyCost: false,
};

export const thumbnailSizeContext = createContext({
  name: 'thumbnailSize',
  creator: (config?: Partial<thumbnailSizeConfig>): thumbnailSizeConfig => ({
    ...defaultThumbnailSizeConfig,
    ...config,
  }),
});

export class ThumbnailImage {
  uri: string;
  height: number;
  width: number;
  actualWidth: number;
  actualHeight: number;
  scale: number;

  constructor(uri: string, targetWidth: number, targetHeight: number, actualWidth?: number, actualHeight?: number) {
    this.uri = uri;
    this.actualHeight = actualHeight || targetHeight;
    this.actualWidth = actualWidth || targetWidth;
    // One trump card for height/width, IIIF specification.
    const matches = uri.match(/full\/([0-9]+),([0-9]+)?\/\d\/\w+/);
    if (matches) {
      const newWidth = +matches[1] || this.actualWidth;
      this.actualHeight = +matches[2] || Math.round((this.actualHeight / this.actualWidth) * newWidth);
      this.actualWidth = newWidth;
    }
    if ((actualHeight && actualWidth) || this.actualWidth !== targetWidth || this.actualHeight !== targetHeight) {
      /**
       *   |------|       |----------|
       *   |      |       |          |
       *   |------|       |----------|
       *  100 / 100   >    150 / 100
       *  =   1       >       1.5
       *  =   false
       *
       *  target: 150x100 scaled down to: 100x66.67 to fit in 100x100
       *  |––––––––––|
       *  |----------|
       *  |          |
       *  |----------|
       *  |——————————|
       *
       *   |------|       |--------|
       *   |      |       |        |
       *   |------|       |        |
       *                  |--------|
       *  100 / 100   >    100 / 150
       *  =   1       >       0.6667
       *  =   true
       *
       *  target: 100x150 scaled down to: 66.67x100 to fit in 100x100
       *  |—|–––––––|—|
       *  | |       | |
       *  | |       | |
       *  |—|———————|—|
       */

      const cropHeight = targetWidth / targetHeight < this.actualWidth / this.actualHeight;
      this.width = Math.round(cropHeight ? targetWidth : targetHeight * (this.actualWidth / this.actualHeight));
      this.height = Math.round(cropHeight ? targetWidth * (this.actualHeight / this.actualWidth) : targetHeight);
      this.scale = +(cropHeight ? this.actualWidth / targetWidth : this.actualHeight / targetHeight).toFixed(2);
    } else {
      this.height = targetHeight;
      this.width = targetWidth;
      this.scale = 1;
    }
  }

  toString(): string {
    return this.uri;
  }
}

const getProperty = (prop: string) => (obj: any) => (obj['@' + prop] ? obj['@' + prop] : obj[prop]);
const getId = getProperty('id');
const getContext = getProperty('context');

export const imageServiceToThumbnail = (
  thumbnailServices: Service[],
  sizeRequest: thumbnailSizeConfig,
  imageWidth: number,
  imageHeight: number
) => {
  for (const thumbnailService of thumbnailServices) {
    const id =
      getId(thumbnailService) && getId(thumbnailService).endsWith('/')
        ? getId(thumbnailService).substr(0, getId(thumbnailService).length - 1)
        : getId(thumbnailService);

    const region = 'full';
    const rotation = 0;
    const quality =
      getContext(thumbnailService) &&
      (getContext(thumbnailService).indexOf('/1.0/context.json') > -1 ||
        getContext(thumbnailService).indexOf('/1.1/context.json') > -1 ||
        getContext(thumbnailService).indexOf('/1/context.json') > -1)
        ? 'native'
        : 'default';

    // For distance function, removes negative sign.
    // @ts-lint ignore
    const abs = (n: number) => (n < 0 ? ~n + 1 : n);
    // Compares distance between two properties from the sizeRequest (width/height)
    const compareDistanceFromSizeRequest = (propName: 'height' | 'width') => (a: any, b: any) => {
      const diffA = Math.abs(a[propName] - sizeRequest[propName]);
      const diffB = Math.abs(b[propName] - sizeRequest[propName]);
      if (diffA < diffB) {
        return -1;
      }
      if (diffA > diffB) {
        return 1;
      }
      return 0;
    };

    if (thumbnailService.sizes && thumbnailService.sizes.length) {
      // There is 4 data points that filter data out, and 2 data points that order.
      // The 4 data points that filter are {min,max}{Height,Width}
      const suitableSizes = thumbnailService.sizes.filter(
        size =>
          size.height <= sizeRequest.maxHeight &&
          size.height >= sizeRequest.minHeight &&
          size.width <= sizeRequest.maxWidth &&
          size.width >= sizeRequest.minWidth
      );

      if (suitableSizes.length) {
        // At this point we will definitely be returning an image, we just need to choose the right one.
        // First order both by height and width (closest to request)
        const heightFirst = suitableSizes.sort(compareDistanceFromSizeRequest('height'))[0];
        const widthFirst = suitableSizes.sort(compareDistanceFromSizeRequest('width'))[0];

        // If they agree, just pick one. If not choose the closest (pixel-wise).
        // Maybe we should just choose the largest one. @todo review.
        const selectedValue =
          heightFirst === widthFirst
            ? widthFirst
            : abs(widthFirst.width - sizeRequest.width) < abs(heightFirst.height - sizeRequest.height)
            ? widthFirst
            : heightFirst;

        return new ThumbnailImage(
          [
            id,
            region,
            [selectedValue.width, selectedValue.height].join(','),
            rotation,
            quality + '.jpg', // @todo format against available.
          ].join('/'),
          sizeRequest.width,
          sizeRequest.height,
          selectedValue.width,
          selectedValue.height
        );
      }
    }

    // If we have tiles
    if (thumbnailService.tiles) {
      const suitableTile = thumbnailService.tiles.filter(
        tile =>
          // Scale factor can encapsulate whole image.
          Math.max(...tile.scaleFactors) * tile.width >= imageWidth &&
          // Within bounds
          tile.width >= sizeRequest.minWidth &&
          tile.width <= sizeRequest.maxWidth,
        []
      );
      if (suitableTile.length) {
        // Within our bounds and scale factor compatible.
        const bestTile = suitableTile.sort(compareDistanceFromSizeRequest('width'))[0];
        const ratio = imageWidth / imageHeight;
        const portrait = imageHeight > imageWidth;
        const bestTileHeight = portrait ? bestTile.width : Math.round(bestTile.width * ratio);
        const bestTileWidth = portrait ? Math.round(bestTile.width * ratio) : bestTile.width;

        return new ThumbnailImage(
          [
            id,
            region,
            [bestTileWidth, ''].join(','),
            rotation,
            quality + '.jpg', // @todo format against available.
          ].join('/'),
          sizeRequest.width,
          sizeRequest.height,
          bestTileWidth,
          bestTileHeight
        );
      }
    }

    if (thumbnailService.profile /* === level 1 or 2 */) {
      // If we have a profile over level 0
    }

    // @todo at this point we could build an image from an image service the tiles.

    // if (sizeRequestInput.follow) {
    //   // If we have follow set to true, we can load the info.json and try to load that.
    // }
  }

  return null;
};

function getThumbnailFromImageResource(
  image: IIIFExternalWebResource,
  config: thumbnailSizeConfig,
  width: number,
  height: number
) {
  if (image.type === 'Image' && typeof image.id !== 'undefined') {
    if (
      thumbnailInBounds(config, { width: image.width, height: image.height }) &&
      (image.id.endsWith('.jpg') || image.id.endsWith('.jpeg'))
    ) {
      return new ThumbnailImage(image.id, config.width, config.height, image.width || 0, image.height || 0);
    }
  }
  return null;
}

function getThumbnailFromContentResource(
  resource: ContentResource,
  config: thumbnailSizeConfig,
  width: number,
  height: number
) {
  if (resource && typeof resource !== 'string') {
    const service = (resource as IIIFExternalWebResource)!.service;
    if (service) {
      // We should be able to return something from this, even if its just the ID.
      const foundThumbnailFromService = imageServiceToThumbnail(service, config, height, width);
      if (foundThumbnailFromService) {
        return foundThumbnailFromService;
      }
    }

    if (resource.type === 'Image') {
      const thumbnailFromImage = getThumbnailFromImageResource(
        resource as IIIFExternalWebResource,
        config,
        width,
        height
      );
      if (thumbnailFromImage) {
        return thumbnailFromImage;
      }
    }
  }

  return null;
}

function thumbnailInBounds<T extends { height?: number; width?: number }>(config: thumbnailSizeConfig, thumbnail: T) {
  if (!thumbnail) {
    return false;
  }
  return (
    (thumbnail.width || Infinity) >= (config.minWidth || 0) &&
    (thumbnail.width || 0) <= (config.maxWidth || Infinity) &&
    (thumbnail.height || Infinity) >= (config.minHeight || 0) &&
    (thumbnail.height || 0) <= (config.maxHeight || Infinity)
  );
}

function isImage(image: string, config: thumbnailSizeConfig) {
  return image && (image.endsWith('.jpg') || image.endsWith('.jpeg'));
}


export const getThumbnailSelector = (state: VaultState, ctx: {
  thumbnailSize?: thumbnailSizeConfig,
  manifest?: ManifestNormalized,
  canvas?: CanvasNormalized,
  // collection?
  // annotation?
}): ThumbnailImage | null => {
  const thumbnailSize = {
    ...defaultThumbnailSizeConfig,
    ...(ctx.thumbnailSize || {}),
  };
  // Note on contexts.
  // Thumbnail size context: optional - use defaults
  // manifest/canvas context - at least one
  // Can be used to get thumbnail for manifest or canvas

  // 0. check thumbnail on manifest (if no canvas context)
  if (ctx.manifest) {
    // @todo
  }

  if (ctx.canvas) {
    // 1. Check thumbnail on canvas.
    if (ctx.canvas.thumbnail) {
      const thumbnails = ctx.canvas.thumbnail;
      for (const thumbnailRef of thumbnails) {
        const image = getThumbnailFromContentResource(
          state.hyperion.entities.ContentResource[thumbnailRef.id],
          thumbnailSize,
          ctx.canvas.width,
          ctx.canvas.height
        );
        if (image) {
          return image;
        }
      }
    }
    // In the case of no thumbnail property, try the first image.
    const firstImage = ctx.canvas.items.map(
      annotationPage => state.hyperion.entities.AnnotationPage[annotationPage.id]
    );
    // First images thumbnail.
    if (firstImage.length && firstImage[0].items && firstImage[0].items.length) {
      for (const annotation of firstImage[0].items) {
        const thumbnails = state.hyperion.entities.Annotation[annotation.id]!.thumbnail || [];
        for (const thumbnailRef of thumbnails) {
          const image = getThumbnailFromContentResource(
            state.hyperion.entities.ContentResource[thumbnailRef.id],
            thumbnailSize,
            ctx.canvas.width,
            ctx.canvas.height
          );
          if (image) {
            return image;
          }
        }
      }
      // Embedded image service on the annotation bodies.
      for (const annotationRef of firstImage[0].items) {
        const bodies = state.hyperion.entities.Annotation[annotationRef.id].body || [];
        for (const body of bodies) {
          const image = getThumbnailFromContentResource(
            state.hyperion.entities.ContentResource[body.id],
            thumbnailSize,
            ctx.canvas.width,
            ctx.canvas.height
          );
          if (image) {
            return image;
          }
        }
      }
    }

    // After this point, we could not find a preferred size.
    // 1) if the thumbnail property on the canvas exists as a string, use that.
    if (ctx.canvas.thumbnail && thumbnailInBounds(thumbnailSize, ctx.canvas)) {
      const thumbnails = ctx.canvas.thumbnail;
      for (const thumbnailRef of thumbnails) {
        const thumbnail = state.hyperion.entities.ContentResource[thumbnailRef.id];
        if (typeof thumbnail === 'string' && isImage(thumbnail, thumbnailSize)) {
          return new ThumbnailImage(
            thumbnail,
            thumbnailSize.width,
            thumbnailSize.height,
            ctx.canvas.width,
            ctx.canvas.height
          );
        }
      }
    }

    // 2) if the thumbnail property on the canvas exists, use its ID.
    if (ctx.canvas.thumbnail) {
      const thumbnails = ctx.canvas.thumbnail;
      for (const thumbnailRef of thumbnails) {
        const thumbnail = state.hyperion.entities.ContentResource[thumbnailRef.id] as IIIFExternalWebResource;
        if (
          thumbnail &&
          thumbnail.id &&
          thumbnailInBounds(thumbnailSize, thumbnail) &&
          isImage(thumbnail.id, thumbnailSize)
        ) {
          return new ThumbnailImage(
            thumbnail.id,
            thumbnailSize.width,
            thumbnailSize.height,
            ctx.canvas.width,
            ctx.canvas.height
          );
        }
      }
    }

    if (firstImage.length && firstImage[0].items && firstImage[0].items.length) {
      for (const annotationRef of firstImage[0].items) {
        const annotation = state.hyperion.entities.Annotation[annotationRef.id];
        const thumbnails = annotation.thumbnail || [];
        for (const thumbnailRef of thumbnails) {
          const thumbnail = state.hyperion.entities.ContentResource[thumbnailRef.id];
          // 3) if the thumbnail property on the first image exists as a string, use that.
          if (
            thumbnail &&
            typeof thumbnail === 'string' &&
            isImage(thumbnail, thumbnailSize)
          ) {
            return new ThumbnailImage(
              thumbnail,
              thumbnailSize.width,
              thumbnailSize.height,
              ctx.canvas.width,
              ctx.canvas.height
            );
          }
          // // 4) if the thumbnail property on the first image exists, use its ID.
          if (
            thumbnail &&
            typeof thumbnail !== 'string' &&
            thumbnail.id &&
            isImage(thumbnail.id, thumbnailSize)
          ) {
            return new ThumbnailImage(
              thumbnail.id,
              thumbnailSize.width,
              thumbnailSize.height,
              ctx.canvas.width,
              ctx.canvas.height
            );
          }
        }

        // @todo this might not return an image resource. Hack could be to
        //   check the extension, another hack might be to make a head request
        //   probably reliant on getting async selectors.
        for (const bodyRef of annotation.body) {
          const body = state.hyperion.entities.ContentResource[bodyRef.id];
          if (
            typeof body !== 'string' &&
            body.type === 'Image' &&
            body.id &&
            isImage(body.id, thumbnailSize)
          ) {
            return new ThumbnailImage(
              body.id,
              thumbnailSize.width,
              thumbnailSize.height,
              ctx.canvas.width,
              ctx.canvas.height
            );
          }
        }
      }
    }
  }

  // 2. Check first image resource on canvas
  //   2a. Thumbnail service
  //   2b. Image service
  //   2c. Build virtual image from image service
  // ---- no preferred size ----
  // 3. Thumbnail on canvas as string
  // 4. Thumbnail ID on canvas
  // 5. Thumbnail on first image as string
  // 6. Thumbnail ID on first image
  // ---- potentially very large images ----
  // 7. ID of first image
  return null;
};

export const getThumbnailAtSize = createSelector({
  context: [thumbnailSizeContext, manifestContext, canvasContext],
  selector: getThumbnailSelector,
});

export const getManifestThumbnailAtSize = createSelector({
  context: [thumbnailSizeContext, manifestContext],
  selector: getThumbnailSelector,
});

export const getCanvasThumbnailAtSize = createSelector({
  context: [thumbnailSizeContext, canvasContext],
  selector: getThumbnailSelector,
});
