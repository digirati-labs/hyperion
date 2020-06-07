import { Reference } from '../reference';
import { ContentResource } from '../resources/contentResource';
import { Service, ServiceNormalized } from '../resources/service';
import { Canvas } from '../resources/canvas';
import { AnnotationCollection } from '../resources/annotationCollection';
import { InternationalString } from './descriptive';
import { ResourceProvider, ResourceProviderNormalized } from '../resources/provider';

export declare type LinkingProperties = {
  seeAlso: ContentResource[];
  service: Service[];
  services: Service[];
  rendering: ContentResource[];
  partOf: Array<ContentResource | Canvas | AnnotationCollection>;
  start: Canvas[];
  supplementary: ContentResource[];
  /**
   * @deprecated since 3.0-beta - use provider.logo
   */
  logo: ContentResource[];
  homepage: ContentResource;
};

export declare type LinkingNormalized = {
  seeAlso: Array<Reference<'ContentResource'>>;
  service: Array<ServiceNormalized>;
  services: Array<ServiceNormalized>;
  rendering: Array<Reference<'ContentResource'>>;
  partOf: Array<Reference<'Collection' | 'Manifest'>>;
  start: Reference<'Canvas' | 'Selector'> | null;
  supplementary: Reference<'AnnotationCollection'> | null;
  /**
   * @deprecated since 3.0-beta - use provider.logo
   */
  logo: Array<Reference<'ContentResource'>>;
  homepage: Reference<'ContentResource'> | null;
};
