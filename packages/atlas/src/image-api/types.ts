export type FixedSizeImage = {
  id: string;
  type: 'fixed';
  width: number;
  height: number;
  unsafe?: boolean;
};

export type FixedSizeImageService = {
  id: string;
  type: 'fixed-service';
  width: number;
  height: number;
};

export type VariableSizeImage = {
  id: string;
  type: 'variable';
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
};

export type UnknownSizeImage = {
  id: string;
  type: 'unknown';
};

export type ImageCandidate = FixedSizeImage | VariableSizeImage | UnknownSizeImage | FixedSizeImageService;

export const STANFORD_IIIF_IMAGE_COMPLIANCE_0 = 'http://library.stanford.edu/iiif/image-api/compliance.html#level0';
export const STANFORD_IIIF_IMAGE_COMPLIANCE_1 = 'http://library.stanford.edu/iiif/image-api/compliance.html#level1';
export const STANFORD_IIIF_IMAGE_COMPLIANCE_2 = 'http://library.stanford.edu/iiif/image-api/compliance.html#level2';
export const STANFORD_IIIF_IMAGE_CONFORMANCE_0 = 'http://library.stanford.edu/iiif/image-api/conformance.html#level0';
export const STANFORD_IIIF_IMAGE_CONFORMANCE_1 = 'http://library.stanford.edu/iiif/image-api/conformance.html#level1';
export const STANFORD_IIIF_IMAGE_CONFORMANCE_2 = 'http://library.stanford.edu/iiif/image-api/conformance.html#level2';
export const STANFORD_IIIF_1_IMAGE_COMPLIANCE_0 =
  'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0';
export const STANFORD_IIIF_1_IMAGE_COMPLIANCE_1 =
  'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1';
export const STANFORD_IIIF_1_IMAGE_COMPLIANCE_2 =
  'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2';
export const STANFORD_IIIF_1_IMAGE_CONFORMANCE_0 =
  'http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level0';
export const STANFORD_IIIF_1_IMAGE_CONFORMANCE_1 =
  'http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level1';
export const STANFORD_IIIF_1_IMAGE_CONFORMANCE_2 =
  'http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level2';
export const IIIF_1_IMAGE_LEVEL_0 = 'http://iiif.io/api/image/1/level0.json';
export const IIIF_1_IMAGE_LEVEL_0_PROFILE = 'http://iiif.io/api/image/1/profiles/level0.json';
export const IIIF_1_IMAGE_LEVEL_1 = 'http://iiif.io/api/image/1/level1.json';
export const IIIF_1_IMAGE_LEVEL_1_PROFILE = 'http://iiif.io/api/image/1/profiles/level1.json';
export const IIIF_1_IMAGE_LEVEL_2 = 'http://iiif.io/api/image/1/level2.json';
export const IIIF_1_IMAGE_LEVEL_2_PROFILE = 'http://iiif.io/api/image/1/profiles/level2.json';
export const IIIF_2_IMAGE_LEVEL_0 = 'http://iiif.io/api/image/2/level0.json';
export const IIIF_2_IMAGE_LEVEL_0_PROFILE = 'http://iiif.io/api/image/2/profiles/level0.json';
export const IIIF_2_IMAGE_LEVEL_1 = 'http://iiif.io/api/image/2/level1.json';
export const IIIF_2_IMAGE_LEVEL_1_PROFILE = 'http://iiif.io/api/image/2/profiles/level1.json';
export const IIIF_2_IMAGE_LEVEL_2 = 'http://iiif.io/api/image/2/level2.json';
export const IIIF_2_IMAGE_LEVEL_2_PROFILE = 'http://iiif.io/api/image/2/profiles/level2.json';
export const IIIF_3_IMAGE_LEVEL_0 = 'level0';
export const IIIF_3_IMAGE_LEVEL_1 = 'level1';
export const IIIF_3_IMAGE_LEVEL_2 = 'level2';
