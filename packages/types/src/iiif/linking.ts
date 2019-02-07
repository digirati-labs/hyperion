import { Reference } from '../reference';
import { ContentResource } from '../resources/contentResource';
import { Service } from '../resources/service';
import { Canvas } from '../resources/canvas';
import { AnnotationCollection } from '../resources/annotationCollection';

export type LinkingProperties = {
  seeAlso: ContentResource[];
  service: Service[];
  logo: ContentResource[];
  homepage: ContentResource[];
  rendering: ContentResource[];
  partOf: Array<ContentResource | Canvas | AnnotationCollection>;
  start: Canvas[];
  supplementary: ContentResource[];
};

export type LinkingNormalized = {
  seeAlso: Array<Reference<'ContentResource'>>;
  service: Array<Reference<'Service'>>;
  logo: Array<Reference<'ContentResource'>>;
  homepage: Reference<'ContentResource'>;
  rendering: Array<Reference<'ContentResource'>>;
  partOf: Array<Reference<'Collection' | 'Manifest'>>;
  start: Reference<'Canvas' | 'Selector'>;
  supplementary: Reference<'AnnotationCollection'>;
};
