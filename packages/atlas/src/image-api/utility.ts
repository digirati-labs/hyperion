import {ContentResource, IIIFExternalWebResource, ImageSize, ImageTile, Service} from '@hyperion-framework/types';
import {
  FixedSizeImageService,
  IIIF_1_IMAGE_LEVEL_0,
  IIIF_1_IMAGE_LEVEL_0_PROFILE,
  IIIF_1_IMAGE_LEVEL_1,
  IIIF_1_IMAGE_LEVEL_1_PROFILE,
  IIIF_1_IMAGE_LEVEL_2,
  IIIF_1_IMAGE_LEVEL_2_PROFILE,
  IIIF_2_IMAGE_LEVEL_0,
  IIIF_2_IMAGE_LEVEL_0_PROFILE,
  IIIF_2_IMAGE_LEVEL_1,
  IIIF_2_IMAGE_LEVEL_1_PROFILE,
  IIIF_2_IMAGE_LEVEL_2,
  IIIF_2_IMAGE_LEVEL_2_PROFILE,
  IIIF_3_IMAGE_LEVEL_0,
  IIIF_3_IMAGE_LEVEL_1,
  IIIF_3_IMAGE_LEVEL_2,
  ImageCandidate,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_0,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_1,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_2,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_0,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_1,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_2,
  STANFORD_IIIF_IMAGE_COMPLIANCE_0,
  STANFORD_IIIF_IMAGE_COMPLIANCE_1,
  STANFORD_IIIF_IMAGE_COMPLIANCE_2,
  STANFORD_IIIF_IMAGE_CONFORMANCE_0,
  STANFORD_IIIF_IMAGE_CONFORMANCE_1,
  STANFORD_IIIF_IMAGE_CONFORMANCE_2,
} from './types';

export function sizesMatch(sizesA: ImageSize[], sizesB: ImageSize[]): boolean {
  if (sizesA.length !== sizesB.length) {
    return false;
  }

  if (sizesA.length === 0 && sizesB.length === 0) {
    return true;
  }

  const len = sizesA.length;
  let matchOrder = true;
  for (let i = 0; i < len; i++) {
    const a = sizesA[i];
    const b = sizesB[i];
    if (a.width !== b.width || a.height !== b.height) {
      matchOrder = false;
      break;
    }
  }
  if (matchOrder) {
    return true;
  }

  let matching = 0;
  for (let a = 0; a < len; a++) {
    for (let b = 0; b < len; b++) {
      if (sizesA[a].width === sizesB[b].width && sizesA[a].height === sizesB[b].height) {
        matching++;
        break;
      }
    }
  }

  return matching === len;
}

export function fixedSizesFromScales(width: number, height: number, scales: number[]): ImageSize[] {
  const len = scales.length;
  const sizes: ImageSize[] = [];
  for (let i = 0; i < len; i++) {
    const scale = scales[i];
    sizes.push({
      width: Math.floor(width / scale),
      height: Math.floor(height / scale),
    });
  }
  return sizes;
}

export function extractFixedSizeScales(width: number, height: number, sizes: ImageSize[]): number[] {
  const len = sizes.length;
  const scales = [];
  for (let i = 0; i < len; i++) {
    const size = sizes[i];
    const w = size.width;
    scales.push(width / w);
  }
  return scales;
}

export function getFixedSizeFromImage(contentResource: ContentResource): ImageCandidate | null {
  if (typeof contentResource === 'string') {
    // Might not even be an image.
    return { type: 'unknown', id: contentResource };
  }

  if (contentResource.type !== 'Image') {
    return null;
  }

  const image = contentResource as IIIFExternalWebResource;

  if (!image.id) {
    return null;
  }

  if (image.id && image.width && image.height) {
    return {
      id: image.id,
      type: 'fixed',
      width: image.width,
      height: image.height,
    };
  }

  return { type: 'unknown', id: image.id };
}

export function getFixedSizesFromService(service: Service): FixedSizeImageService[] {
  return (service && service.sizes ? service.sizes : []).map(size => {
    return {
      id: service.id,
      type: 'fixed-service',
      height: size.height,
      width: size.width,
    };
  });
}

export function canonicalServiceUrl(serviceId: string) {
  return serviceId.endsWith('info.json')
    ? serviceId
    : serviceId.endsWith('/')
    ? `${serviceId}info.json`
    : `${serviceId}/info.json`;
}

export function getImageServerFromId(url: string): string {
  // Strip off the protocol + www
  const id = url.replace(/(https?:\/\/)?(www.)?/i, '');

  // Strip off the path.
  if (id.indexOf('/') !== -1) {
    return id.split('/')[0];
  }

  // Return the id.
  return id;
}

const level1Support = [
  STANFORD_IIIF_IMAGE_COMPLIANCE_1,
  STANFORD_IIIF_IMAGE_COMPLIANCE_2,
  STANFORD_IIIF_IMAGE_CONFORMANCE_1,
  STANFORD_IIIF_IMAGE_CONFORMANCE_2,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_1,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_2,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_1,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_2,
  IIIF_1_IMAGE_LEVEL_1,
  IIIF_1_IMAGE_LEVEL_1_PROFILE,
  IIIF_1_IMAGE_LEVEL_2,
  IIIF_1_IMAGE_LEVEL_2_PROFILE,
  IIIF_2_IMAGE_LEVEL_1,
  IIIF_2_IMAGE_LEVEL_1_PROFILE,
  IIIF_2_IMAGE_LEVEL_2,
  IIIF_2_IMAGE_LEVEL_2_PROFILE,
  IIIF_3_IMAGE_LEVEL_1,
  IIIF_3_IMAGE_LEVEL_2,
];

export function supportsCustomSizes(service: Service): boolean {
  if (!isImageService(service)) {
    return false;
  }

  const profiles = Array.isArray(service.profile) ? service.profile : [service.profile];

  for (const profile of profiles) {
    if (typeof profile === 'string') {
      if (level1Support.indexOf(profile) !== -1) {
        return true;
      }
    } else {
      const supports = profile.supports || [];
      if (
        supports.indexOf('regionByPx') !== -1 &&
        (supports.indexOf('sizeByW') !== -1 || supports.indexOf('sizeByWh') !== -1)
      ) {
        return true;
      }
    }
  }

  return false;
}

export function getCustomSizeFromService(service: Service): ImageCandidate[] {
  if (!supportsCustomSizes(service)) {
    return [];
  }

  const imagesSizes: ImageCandidate[] = [];

  // Check for max width in profile.
  const profiles = Array.isArray(service.profile) ? service.profile : [service.profile];

  const pLen = profiles.length;
  for (let x = 0; x < pLen; x++) {
    const profile = profiles[pLen];
    if (typeof profile !== 'string') {
      if (profile.maxHeight || profile.maxWidth) {
        return [
          {
            id: service.id,
            type: 'variable',
            minWidth: 0,
            minHeight: 0,
            maxHeight: (profile.maxHeight || profile.maxWidth) as number,
            maxWidth: (profile.maxWidth || profile.maxHeight) as number,
          },
        ];
      }
    }
  }

  if (service.tiles) {
    const len = service.tiles.length;
    for (let y = 0; y < len; y++) {
      const tile = service.tiles[y];
      if (tile.height || tile.width) {
        imagesSizes.push({
          id: service.id,
          type: 'variable',
          minHeight: 0,
          minWidth: 0,
          maxHeight: tile.height || tile.width,
          maxWidth: tile.width || tile.width,
        });
      }
    }
  }

  return imagesSizes;
}

export function dereferenceImageService(service: Service): Promise<Service> {
  return Promise.resolve(service);
}

export function getSmallestScaleFactorAsSingleImage(service: Service): FixedSizeImageService | null {
  if (!service.width || !service.height) {
    return null;
  }

  if (service.tiles) {
    const len = service.tiles.length;
    for (let i = 0; i < len; i++) {
      const tile = service.tiles[i];
      const targetSize = tile.width || tile.height;
      if (!targetSize) {
        continue;
      }
      const sizeLen = tile.scaleFactors.length;
      const sortedScales = tile.scaleFactors.sort();
      for (let j = 0; j < sizeLen; j++) {
        const size = sortedScales[len - j];
        if (service.width / size < targetSize && service.height / size < targetSize) {
          return {
            id: service.id,
            type: 'fixed-service',
            width: (service.width / size) | 0,
            height: (service.height / size) | 0,
          };
        }
      }
    }
  }
  return null;
}

export function sampledTilesToTiles(width: number, height: number, sampledTiles: ImageTile[]): ImageTile[] {
  const maxDim = width > height ? width : height;
  const len = sampledTiles.length;
  const newTiles: ImageTile[] = [];

  for (let i = 0; i < len; i++) {
    const tile = sampledTiles[i];
    let lastSize = tile.scaleFactors[0];
    let curWidth = maxDim / lastSize;
    const scaleFactors = [lastSize];
    while (curWidth >= tile.width) {
      lastSize = lastSize * 2;
      scaleFactors.push(lastSize);
      curWidth = curWidth / 2;
    }

    newTiles.push({
      ...tile,
      scaleFactors,
    });
  }

  return newTiles;
}

export function isImageService(service: Service): boolean {
  if (!service || !service.profile) {
    return false;
  }

  const profiles = Array.isArray(service.profile) ? service.profile : [service.profile];

  for (const profile of profiles) {
    switch (profile) {
      case STANFORD_IIIF_IMAGE_COMPLIANCE_0:
      case STANFORD_IIIF_IMAGE_COMPLIANCE_1:
      case STANFORD_IIIF_IMAGE_COMPLIANCE_2:
      case STANFORD_IIIF_IMAGE_CONFORMANCE_0:
      case STANFORD_IIIF_IMAGE_CONFORMANCE_1:
      case STANFORD_IIIF_IMAGE_CONFORMANCE_2:
      case STANFORD_IIIF_1_IMAGE_COMPLIANCE_0:
      case STANFORD_IIIF_1_IMAGE_COMPLIANCE_1:
      case STANFORD_IIIF_1_IMAGE_COMPLIANCE_2:
      case STANFORD_IIIF_1_IMAGE_CONFORMANCE_0:
      case STANFORD_IIIF_1_IMAGE_CONFORMANCE_1:
      case STANFORD_IIIF_1_IMAGE_CONFORMANCE_2:
      case IIIF_1_IMAGE_LEVEL_0:
      case IIIF_1_IMAGE_LEVEL_0_PROFILE:
      case IIIF_1_IMAGE_LEVEL_1:
      case IIIF_1_IMAGE_LEVEL_1_PROFILE:
      case IIIF_1_IMAGE_LEVEL_2:
      case IIIF_1_IMAGE_LEVEL_2_PROFILE:
      case IIIF_2_IMAGE_LEVEL_0:
      case IIIF_2_IMAGE_LEVEL_0_PROFILE:
      case IIIF_2_IMAGE_LEVEL_1:
      case IIIF_2_IMAGE_LEVEL_1_PROFILE:
      case IIIF_2_IMAGE_LEVEL_2:
      case IIIF_2_IMAGE_LEVEL_2_PROFILE:
      case IIIF_3_IMAGE_LEVEL_0:
      case IIIF_3_IMAGE_LEVEL_1:
      case IIIF_3_IMAGE_LEVEL_2:
        return true;
    }
  }

  return false;
}
