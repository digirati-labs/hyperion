import { Reference } from '../reference';
import { OmitProperties } from '../utility';

export declare type InternationalString = {
  [language: string]: string[];
};

export declare type MetadataItem = {
  label: InternationalString;
  value: InternationalString;
};

export declare type DescriptiveProperties = {
  label: InternationalString | null;
  metadata: MetadataItem[];
  summary: InternationalString | null;
  requiredStatement: MetadataItem | null;
  rights: string | null;
  navDate: string | null;
  language: string[];
  // @todo Thumbnail
  thumbnail: any;
  // @todo Poster canvas
  posterCanvas: any;
};

export declare type DescriptiveNormalized = OmitProperties<DescriptiveProperties, 'thumbnail' | 'posterCanvas'> & {
  thumbnail: Array<Reference<'ContentResource'>>;
  posterCanvas: Reference<'Canvas'> | null;
};
