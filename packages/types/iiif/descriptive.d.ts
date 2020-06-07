import { Reference } from '../reference';
import { OmitProperties } from '../utility';
import { Canvas, ContentResource } from '..';
import { ResourceProvider, ResourceProviderNormalized } from '../resources/provider';

export declare type InternationalString = {
  [language: string]: string[] | undefined;
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
  thumbnail: ContentResource[];
  provider: ResourceProvider[];
  placeholderCanvas: Canvas;
  accompanyingCanvas: Canvas;

  /**
   * @deprecated since 3.0-beta - use placeholderCanvas or accompanyingCanvas
   */
  posterCanvas: Canvas;
};

export declare type DescriptiveNormalized = OmitProperties<
  DescriptiveProperties,
  'provider' | 'thumbnail' | 'accompanyingCanvas' | 'placeholderCanvas' | 'posterCanvas'
> & {
  thumbnail: Array<Reference<'ContentResource'>>;
  placeholderCanvas: Reference<'Canvas'> | null;
  accompanyingCanvas: Reference<'Canvas'> | null;
  provider: Array<ResourceProviderNormalized>;

  /**
   * @deprecated since 3.0-beta - use placeholderCanvas or accompanyingCanvas
   */
  posterCanvas: Reference<'Canvas'> | null;
};
