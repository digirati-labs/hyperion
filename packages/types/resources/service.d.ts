import { OmitProperties } from '../utility';

export declare type ImageSize = { width: number; height: number };

export declare type ImageTile = {
  width: number;
  height?: number;
  scaleFactors: number[];
  maxWidth?: number;
  maxHeight?: number;
};

// @todo add in IIIF-Vocabulary
export declare type ImageProfile =
  | string
  | {
      '@context'?: 'http://iiif.io/api/image/2/context.json';
      '@type'?: 'iiif:ImageProfile';
      type?: 'ImageProfile';
      formats?: string[];
      qualities?: string[];
      supports?: string[];
      maxArea?: number;
      maxHeight?: number;
      maxWidth?: number;
    };

export interface Service {
  '@context'?: string | string[];
  '@id'?: string;
  id: string;
  profile: ImageProfile | ImageProfile[];
  protocol?: string;
  width?: number | null;
  height?: number | null;
  sizes?: ImageSize[];
  tiles?: ImageTile[];
}

export declare type ServiceNormalized = Required<OmitProperties<Service, '@context' | '@id'>>;
