import { InternationalString } from '../iiif/descriptive';
import { Reference } from '../reference';
import { ContentResource } from './contentResource';

export declare type ResourceProvider = {
  id: string;
  type: 'Agent';
  label: InternationalString;
  homepage?: ContentResource;
  logo?: ContentResource[];
  seeAlso?: ContentResource[];
};

export declare type ResourceProviderNormalized = {
  id: string;
  type: 'Agent';
  label: InternationalString;
  homepage: Reference<'ContentResource'> | null;
  logo: Array<Reference<'ContentResource'>>;
  seeAlso: Array<Reference<'ContentResource'>>;
};
