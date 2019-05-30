import { ContentResource, IIIFExternalWebResource, ImageSize, ImageTile, Service } from '@hyperion-framework/types';
import {
  FixedSizeImage,
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
  UnknownSizeImage,
  VariableSizeImage,
} from './types';
import { imageServiceLoader, ImageServiceLoader, ImageServiceRequest } from './image-service-loader';

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

export function inferSizeFromUrl(image: string): ImageCandidate {
  const regex = /^.*\/(full)\/(((\d+),(\d+)?)|max)\/(\d+)\/default\.(jpg|png|jpeg)$/;
  const match = image.match(regex);

  if (match) {
    const region = match[1];
    const width = parseInt(match[4], 10);
    const height = parseInt(match[5], 10);
    // const rotation = parseInt(match[6], 10);
    const format = match[7];

    if ((region === 'max' || region === 'full') && width && height && format) {
      return {
        type: 'fixed',
        id: image,
        height,
        width,
      };
    }
  }

  return { type: 'unknown', id: image };
}

export function getFixedSizeFromImage(contentResource: ContentResource): ImageCandidate | null {
  if (typeof contentResource === 'string') {
    // Might not even be an image.
    return inferSizeFromUrl(contentResource);
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

  return inferSizeFromUrl(image.id);
}

export function getFixedSizesFromService(service: Service): FixedSizeImageService[] {
  if (!isImageService(service)) {
    return [];
  }
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

const imageServiceProfiles = [
  STANFORD_IIIF_IMAGE_COMPLIANCE_0,
  STANFORD_IIIF_IMAGE_COMPLIANCE_1,
  STANFORD_IIIF_IMAGE_COMPLIANCE_2,
  STANFORD_IIIF_IMAGE_CONFORMANCE_0,
  STANFORD_IIIF_IMAGE_CONFORMANCE_1,
  STANFORD_IIIF_IMAGE_CONFORMANCE_2,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_0,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_1,
  STANFORD_IIIF_1_IMAGE_COMPLIANCE_2,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_0,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_1,
  STANFORD_IIIF_1_IMAGE_CONFORMANCE_2,
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

export function getImageCandidatesFromService(service: Service[]): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];

  const totalServices = service.length;
  for (let s = 0; s < totalServices; s++) {
    // - x.2 embedded service - fixed sizes
    const fixedSizes = getFixedSizesFromService(service[s]);
    if (fixedSizes.length) {
      candidates.push(...fixedSizes);
    }
    // - x.3 embedded service - profile 1 / 2 (custom size)
    const customSizes = getCustomSizeFromService(service[s]);
    if (customSizes.length) {
      candidates.push(...customSizes);
    }
  }

  return candidates;
}

type ImageCandidateRequest = {
  width: number;
  height: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  // Configurations
  fallback?: boolean;
  atAnyCost?: boolean;
  unsafeImageService?: boolean;
  returnAllOptions?: boolean;
  preferFixedSize?: boolean;
};

export function isBestMatch(
  request: Required<ImageCandidateRequest>,
  current: FixedSizeImage | null,
  candidate: FixedSizeImage
) {
  return (
    candidate.height <= request.maxHeight &&
    candidate.width <= request.maxWidth &&
    candidate.height >= request.minHeight &&
    candidate.width >= request.minWidth &&
    (!current || Math.abs(candidate.width - request.width) < Math.abs(current.width - request.width))
  );
}

/**
 * Pick best from candidates
 *
 * Takes in a list of candidate lists. The order should be in preference. This algorithm will try to pick
 * from the first list, with a best fit size. If not it will fallback to the other lists. It may come back
 * around to the first list and provide a fallback.
 *
 * @param inputRequest
 * @param candidates
 */
export function pickBestFromCandidates(
  inputRequest: ImageCandidateRequest,
  candidates: Array<() => ImageCandidate[]>
): { best: ImageCandidate | null; fallback: ImageCandidate[] } {
  const request: Required<ImageCandidateRequest> = Object.assign(
    {
      unsafeImageService: true,
      atAnyCost: true,
      fallback: true,
      minHeight: 20,
      minWidth: 20,
      maxHeight: Infinity,
      maxWidth: Infinity,
      returnAllOptions: false,
      preferFixedSize: false,
    },
    inputRequest
  );
  const lastResorts: UnknownSizeImage[] = [];
  const fallback: Array<FixedSizeImage | VariableSizeImage> = [];
  let currentChoice: ImageCandidate | null = null;

  const swapChoice = (candidate: FixedSizeImage, current: FixedSizeImage | null) => {
    if (isBestMatch(request, current, candidate)) {
      // If we prefer a fixed size, we'll push it onto the fallback. But a fixed size will be looked for
      // from all of the candidates.
      if (request.preferFixedSize && candidate.unsafe) {
        fallback.push(candidate);
        return;
      }

      if (request.returnAllOptions && current) {
        fallback.push(current);
      }
      // We have a new candidate.
      currentChoice = candidate;
    } else if (request.returnAllOptions) {
      fallback.push(candidate);
    }
  };

  const candidateGroups = candidates.length;
  for (let x = 0; x < candidateGroups; x++) {
    const group = candidates[x]();
    const candidatesLength = group.length;
    for (let y = 0; y < candidatesLength; y++) {
      const candidate = group[y];
      if (candidate.type === 'unknown' && request.atAnyCost) {
        lastResorts.push(candidate);
      }
      if (candidate.type === 'fixed') {
        swapChoice(candidate, currentChoice);
      }
      if (candidate.type === 'fixed-service') {
        if (request.unsafeImageService) {
          const choice = getImageFromTileSource(candidate, request.width, request.height);
          swapChoice(choice, currentChoice);
        } else {
          const ratio = request.width / request.height;
          const portrait = request.width > request.height;
          const bestTileHeight = portrait ? candidate.width : Math.round(candidate.width * ratio);
          const bestTileWidth = portrait ? Math.round(candidate.width * ratio) : candidate.width;
          const choice = getImageFromTileSource(candidate, bestTileWidth, bestTileHeight);
          swapChoice(choice, currentChoice);
        }
      }
    }
    if (currentChoice && !request.returnAllOptions) {
      break;
    }
  }

  if (request.atAnyCost && fallback.length === 0) {
    return {
      best: currentChoice || lastResorts[0],
      fallback: lastResorts.slice(1),
    };
  }

  if (request.returnAllOptions) {
    return {
      best: request.atAnyCost ? currentChoice || fallback[0] || lastResorts[0] : currentChoice || fallback[0],
      fallback: [...fallback, ...lastResorts],
    };
  }

  return {
    best: currentChoice || fallback[0] || null,
    fallback: currentChoice ? fallback : fallback.slice(1),
  };
}

export function getImageFromTileSource(
  image: FixedSizeImageService,
  targetWidth: number,
  targetHeight?: number
): FixedSizeImage {
  const id = canonicalServiceUrl(image.id).slice(0, -10);
  const url = [
    id,
    'full',
    [targetWidth, targetHeight || ''].join(','), // @todo profile check for supports
    0,
    'default.jpg', // @todo format against available.
  ].join('/');

  return {
    id: url,
    type: 'fixed',
    width: targetWidth,
    height: targetHeight || (image.height / image.width) * targetWidth,
    unsafe: image.width > targetWidth,
  };
}

/**
 * Get image candidates
 *
 * Given an unknown resource, and optionally an image service loader, it will try to get all of the possible
 * options for images at a specific size. Note: if you are wanting to depend on external web resources, then
 * you have to either preload these, or prepare the image loader for predicting them.
 *
 * @param unknownResource
 * @param dereference
 * @param loader
 */
export function getImageCandidates(
  unknownResource: ContentResource,
  dereference: boolean = true,
  loader: ImageServiceLoader = imageServiceLoader
): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];
  const fixedSizeFromImage = getFixedSizeFromImage(unknownResource);
  if (fixedSizeFromImage === null) {
    return candidates;
  }
  // Cast to IIIF resource, assuming we are working in that context.
  const resource = unknownResource as IIIFExternalWebResource;

  // - x.1 fixed size
  // - x.4 ID of thumbnail (without width/height)
  candidates.push(fixedSizeFromImage);

  // We will try to dereference if available (cache or prediction).
  if (dereference) {
    const services = resource.service || [];
    const totalServices = services.length;
    const refCandidates = [];
    for (let i = 0; i < totalServices; i++) {
      if (isImageService(services[i]) && resource.width && resource.height) {
        const request: ImageServiceRequest = {
          id: services[i].id,
          width: resource.width,
          height: resource.height,
        };
        if (loader.canLoadSync(request)) {
          const externalService = loader.loadServiceSync(request);
          if (externalService) {
            if (!externalService.height) {
              externalService.height = resource.height;
            }
            if (!externalService.width) {
              externalService.width = resource.width;
            }
            refCandidates.push(...getImageCandidatesFromService([externalService]));
          }
        }
      }
    }
    if (refCandidates.length) {
      candidates.push(...refCandidates);
      return candidates;
    }
  }

  // Embedded service.
  if (resource.service) {
    candidates.push(...getImageCandidatesFromService(resource.service));
  }

  return candidates;
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
    const profile = profiles[x];
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
          maxWidth: tile.width,
        });
      }
    }
  }

  return imagesSizes;
}

export function getSmallestScaleFactorAsSingleImage(service: Service): FixedSizeImageService | null {
  if (!service.width || !service.height) {
    return null;
  }

  if (service.tiles) {
    const tiles = service.tiles.sort((a, b) => {
      return Math.max(...b.scaleFactors) - Math.max(...a.scaleFactors);
    });
    const len = tiles.length;
    for (let i = 0; i < len; i++) {
      const tile = tiles[i];
      // @todo possible refinement.
      // const targetSize = tile.width > (tile.height || 0) ? tile.width : tile.height;
      const targetSize = tile.width;
      if (!targetSize) {
        continue;
      }
      const sizeLen = tile.scaleFactors.length;
      const sortedScales = tile.scaleFactors.sort();
      for (let j = 0; j < sizeLen; j++) {
        const size = sortedScales[j];
        if (service.width / size <= targetSize && service.height / size <= targetSize) {
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
    if (typeof profile === 'string' && imageServiceProfiles.indexOf(profile) !== -1) {
      return true;
    }
  }

  return false;
}
