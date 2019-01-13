/*
getSeeAlso,
  getService,
  getLogo,
  getHomepage,
  getRendering,
  getPartOf,
  getStart,
  getSupplementary,
 */

import { Reference, SingleReference } from '../reference';
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
  seeAlso: Array<SingleReference<'contentResource'>>;
  service: Array<SingleReference<'service'>>;
  logo: Array<SingleReference<'contentResource'>>;
  homepage: SingleReference<'contentResource'>;
  rendering: Array<SingleReference<'contentResource'>>;
  partOf: Array<Reference<'collection' | 'manifest'>>;
  start: Reference<'canvas' | 'canvasReference' | 'selector'>;
  supplementary: SingleReference<'annotationCollection'>;
};
