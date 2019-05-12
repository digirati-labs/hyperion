import {OmitProperties, SomeRequired} from "../utility";

export declare type ImageSize = { width: number; height: number };

export declare type ImageTile = {
  width: number;
  height?: number;
  scaleFactors: number[];
};

// @todo add in IIIF-Vocabulary
export declare type ImageProfile =
  | string
  | {
      formats: string[];
      qualities: string[];
      supports: string[];
    };

export interface Service {
  '@context'?: string | string[];
  id: string;
  profile: ImageProfile | ImageProfile[];
  protocol?: string;
  width?: number | null;
  height?: number | null;
  sizes?: ImageSize[];
  tiles?: ImageTile[];
}

export declare type ServiceNormalized = Required<OmitProperties<Service, '@context'>>;
