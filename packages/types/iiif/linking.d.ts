import { Reference } from '../reference';
import { ContentResource } from '../resources/contentResource';
import { Service, ServiceNormalized } from '../resources/service';
import { Canvas } from '../resources/canvas';
import { AnnotationCollection } from '../resources/annotationCollection';

export declare type LinkingProperties = {
  seeAlso: ContentResource[];
  service: Service[];
  logo: ContentResource[];
  homepage: ContentResource;
  rendering: ContentResource[];
  partOf: Array<ContentResource | Canvas | AnnotationCollection>;
  start: Canvas[];
  supplementary: ContentResource[];
};

export declare type LinkingNormalized = {
  seeAlso: Array<Reference<'ContentResource'>>;
  service: Array<ServiceNormalized>;
  logo: Array<Reference<'ContentResource'>>;
  homepage: Reference<'ContentResource'> | null;
  rendering: Array<Reference<'ContentResource'>>;
  partOf: Array<Reference<'Collection' | 'Manifest'>>;
  start: Reference<'Canvas' | 'Selector'> | null;
  supplementary: Reference<'AnnotationCollection'> | null;
};
