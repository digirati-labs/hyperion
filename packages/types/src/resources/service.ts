export type ImageSize = { width: number; height: number };

export type ImageTile = {
  width: number;
  scaleFactors: number[];
};

// @todo add in IIIF-Vocabulary
export type ImageProfile =
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
  protocol: string;
  width?: number;
  height?: number;
  sizes?: ImageSize[];
  tiles?: ImageTile[];
}
