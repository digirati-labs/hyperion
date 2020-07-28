/// <reference types="geojson" />

import { ContentResource, Service } from '..';

export declare type ImageServiceProfile =
  | 'http://library.stanford.edu/iiif/image-api/compliance.html#level0'
  | 'http://library.stanford.edu/iiif/image-api/compliance.html#level1'
  | 'http://library.stanford.edu/iiif/image-api/compliance.html#level2'
  | 'http://library.stanford.edu/iiif/image-api/conformance.html#level0'
  | 'http://library.stanford.edu/iiif/image-api/conformance.html#level1'
  | 'http://library.stanford.edu/iiif/image-api/conformance.html#level2'
  | 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0'
  | 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1'
  | 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2'
  | 'http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level0'
  | 'http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level1'
  | 'http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level2'
  | 'http://iiif.io/api/image/1/level0.json'
  | 'http://iiif.io/api/image/1/profiles/level0.json'
  | 'http://iiif.io/api/image/1/level1.json'
  | 'http://iiif.io/api/image/1/profiles/level1.json'
  | 'http://iiif.io/api/image/1/level2.json'
  | 'http://iiif.io/api/image/1/profiles/level2.json'
  | 'http://iiif.io/api/image/2/level0.json'
  | 'http://iiif.io/api/image/2/profiles/level0.json'
  | 'http://iiif.io/api/image/2/level1.json'
  | 'http://iiif.io/api/image/2/profiles/level1.json'
  | 'http://iiif.io/api/image/2/level2.json'
  | 'http://iiif.io/api/image/2/profiles/level2.json'
  | 'http://iiif.io/api/image/3/level0.json'
  | 'http://iiif.io/api/image/3/level1.json'
  | 'http://iiif.io/api/image/3/level2.json'
  | 'level0'
  | 'level1'
  | 'level2';

export declare type ImageSize = { width: number; height: number };

export declare type ImageTile = {
  width: number;
  height?: number;
  scaleFactors: number[];
  maxWidth?: number;
  maxHeight?: number;
};

export declare type ImageProfile =
  | ImageServiceProfile
  | {
      '@context'?: string;
      '@type'?: 'iiif:ImageProfile';
      type?: 'ImageProfile';
      formats?: string[];
      qualities?: string[];
      supports?: string[];
      maxArea?: number;
      maxHeight?: number;
      maxWidth?: number;
    };

export interface ImageService2 {
  '@context'?: string | string[];
  '@id': string;
  profile: ImageProfile | ImageProfile[];
  protocol?: string;
  width?: number | null;
  height?: number | null;
  attribution?: string;
  sizes?: ImageSize[];
  tiles?: ImageTile[];
  logo?: ContentResource | ContentResource[]; // Presentation 2 service may have non-array.
  service?: Service[];
}

export interface ImageService3 {
  '@context'?: string | string[];
  id: string;
  type: 'ImageService1' | 'ImageService2' | 'ImageService3';
  profile: 'level0' | 'level1' | 'level2';
  protocol?: string;
  width?: number | null;
  height?: number | null;
  attribution?: string;
  sizes?: ImageSize[];
  tiles?: ImageTile[];
  logo?: ContentResource[]; // Presentation 2 service may have non-array.
  extraFormats?: string[];
  extraQualities?: string[];
  extraFeatures?: string[];
  service?: Service[];
}

// General purpose image service definition.
export interface ImageService {
  '@context'?: string | string[];
  '@id'?: string;
  id: string;
  type?: 'ImageService1' | 'ImageService2' | 'ImageService3';
  profile: ImageProfile | ImageProfile[];
  protocol?: string;
  width?: number | null;
  height?: number | null;
  attribution?: string;
  sizes?: ImageSize[];
  tiles?: ImageTile[];
  logo?: ContentResource[]; // Presentation 2 service may have non-array.
  extraFormats?: string[];
  extraQualities?: string[];
  extraFeatures?: string[];
  service?: Service[];
}
