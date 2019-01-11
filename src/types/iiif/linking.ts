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

import {Reference, SingleReference} from '../reference';

export type LinkingProperties = {
    // @todo see also
    seeAlso: [any];
    // @todo service
    service: [any];
    // @todo logo
    logo: [any];
    // @todo homepage
    homepage: [any];
    // @todo rendering
    rendering: [any];
    // @todo part of
    partOf: [any];
    // @todo start
    start: [any];
    // @todo supplementary
    supplementary: [any];
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
