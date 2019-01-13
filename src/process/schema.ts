import { schema, normalize } from 'normalizr';
import { addMissingIds, buildProcess } from '../utility/compatibility';

const collection = new schema.Entity('collections');
const manifest = new schema.Entity('manifests');
const canvas = new schema.Entity('canvases');
const annotation = new schema.Entity('annotations');
const annotationPage = new schema.Entity('annotationPages');
const annotationCollection = new schema.Entity('annotationCollections');
const range = new schema.Entity('ranges');
const contentResource = new schema.Entity('contentResources');
const choice = new schema.Entity('choices');
const canvasReference = new schema.Entity('canvasReferences');
const selector = new schema.Entity('selectors', {
  id: canvas,
});

// Unofficial types
const service = new schema.Entity('services');

// Union types
const partOf = new schema.Array(
  {
    collection,
    manifest,
    contentResource,
    annotationCollection,
  },
  entity => {
    switch (entity.type) {
      case 'Collection':
        return 'collection';
      case 'Manifest':
        return 'manifest';
      case 'AnnotationCollection':
        return 'annotationCollection';
      default:
        return 'contentResource';
    }
  }
);

const canvasOrReference = new schema.Union(
  {
    selector,
    canvasReference,
    canvas,
  },
  entity => {
    if (entity && entity.id && entity.id.indexOf('#') !== -1) {
      return 'selector';
    }
    if (entity.type === 'SpecificResource') {
      return 'canvasReference';
    }
    return 'canvas';
  }
);

type AnnotationBodyTypes = 'choice' | 'contentResource';

const annotationBodyMappings: { [index: string]: AnnotationBodyTypes } = {
  Choice: 'choice',
  List: 'choice',
  Independents: 'choice',
  Application: 'contentResource',
  Dataset: 'contentResource',
  Image: 'contentResource',
  Sound: 'contentResource',
  Text: 'contentResource',
  Video: 'contentResource',
  TextualBody: 'contentResource',
};
const annotationBody = new schema.Union(
  {
    contentResource,
    choice,
  },
  (input: any): AnnotationBodyTypes => {
    if (annotationBodyMappings[input.type]) {
      return annotationBodyMappings[input.type];
    }
    return 'contentResource';
  }
);

const rangeItem = new schema.Union(
  {
    canvas,
    selector,
    range,
    canvasReference,
  },
  input => {
    if (input && input.id && input.id.indexOf('#') !== -1) {
      return 'selector';
    }

    switch (input.type) {
      case 'Canvas':
        return 'canvas';
      case 'Range':
        return 'range';
      case 'SpecificResource':
      default:
        // @todo default?
        return 'canvasReference';
    }
  }
);

// Root resource

type DereferencableResourceTypes =
  | 'collection'
  | 'sequence'
  | 'manifest'
  | 'canvas'
  | 'annotationCollection'
  | 'annotationPage'
  | 'annotation'
  | 'range'
  | 'contentResource'
  | 'service';

const RESOURCE_TYPE_MAP: { [index: string]: DereferencableResourceTypes } = {
  Collection: 'collection',
  Sequence: 'sequence',
  Manifest: 'manifest',
  Canvas: 'canvas',
  AnnotationCollection: 'annotationCollection',
  AnnotationPage: 'annotationPage',
  Annotation: 'annotation',
  Range: 'range',
  // Content resources.
  Application: 'contentResource',
  Dataset: 'contentResource',
  Image: 'contentResource',
  Sound: 'contentResource',
  Text: 'contentResource',
  Video: 'contentResource',
  TextualBody: 'contentResource',
};
const resource = new schema.Union(
  {
    collection,
    manifest,
    canvas,
    annotationCollection,
    annotationPage,
    annotation,
    range,
    contentResource,
    service,
  },
  (entity: any): DereferencableResourceTypes => {
    if (RESOURCE_TYPE_MAP[entity.type]) {
      return RESOURCE_TYPE_MAP[entity.type];
    }
    if (entity.profile) {
      return 'service';
    }
    throw Error('Unknown entity type');
  }
);

// ===========================================================================
// 1) Collections
// ===========================================================================
collection.define({
  // Structural
  items: new schema.Array(
    {
      collection,
      manifest,
    },
    entity => (entity.type === 'Manifest' ? 'manifest' : 'collection')
  ),
  annotations: [annotationPage],

  // Linking.
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  homepage: contentResource,
  rendering: [contentResource],
  partOf: partOf,

  // Extra.
  thumbnail: [contentResource],
  posterCanvas: canvas,
});

// ===========================================================================
// 2) Manifests
// ===========================================================================
manifest.define({
  items: [canvas],
  structures: [range],
  annotations: [annotationPage],

  // Linking
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  homepage: contentResource,
  rendering: [contentResource],
  partOf: partOf,
  start: canvasOrReference,

  // Extra
  thumbnail: [contentResource],
  posterCanvas: canvas,
});

// ===========================================================================
// 3) Canvases
// ===========================================================================
canvas.define({
  // Structural.
  items: [annotationPage],
  annotations: [annotationPage],

  // Linking
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  homepage: contentResource,
  rendering: [contentResource],
  partOf: partOf,

  // Extra
  thumbnail: [contentResource],
  posterCanvas: canvas,
});

// ===========================================================================
// 4) Annotation
// ===========================================================================
annotation.define({
  // Structural.
  body: [annotationBody],
  target: [selector],

  // Linking
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  homepage: contentResource,
  rendering: [contentResource],
  partOf: partOf,

  // Extra
  thumbnail: [contentResource],
});

// ===========================================================================
// 5) Annotation Collection
// ===========================================================================
annotationCollection.define({
  // Structural.
  items: [annotationPage],

  // Linking
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  homepage: contentResource,
  rendering: [contentResource],
  partOf: partOf,

  // extra
  thumbnail: [contentResource],

  // Paging.
  first: annotationPage,
  last: annotationPage,
});

// ===========================================================================
// 6) Annotation Page
// ===========================================================================
annotationPage.define({
  // Structural.
  items: [annotation],

  // Linking
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  homepage: contentResource,
  rendering: [contentResource],
  partOf: partOf,

  // Extra
  thumbnail: [contentResource],

  // Paging.
  next: annotationPage,
  previous: annotationPage,
});

// ===========================================================================
// 7) Range
// ===========================================================================
range.define({
  // Structural.
  items: [rangeItem],
  annotations: [annotationPage],

  // Linking
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  homepage: contentResource,
  rendering: [contentResource],
  partOf: partOf,
  start: canvasOrReference,
  supplementary: annotationCollection,

  // Extra
  thumbnail: [contentResource],
});

// ===========================================================================
// 8) Content Resource
// ===========================================================================
contentResource.define({
  // Linking.
  seeAlso: [contentResource],
  service: [service],
  logo: [contentResource],
  rendering: [contentResource],
  partOf: partOf,
  // Structural
  annotations: [annotationPage],
});

// ===========================================================================
// 9) Choice
// ===========================================================================
choice.define({
  default: annotation,
  item: [annotation],
});

// ===========================================================================
// 10) Canvas Reference
// ===========================================================================
canvasReference.define({
  source: canvas,
});

const preprocess = buildProcess([addMissingIds]);

const normalizeResource = (rawResource: any, customSchema = resource) =>
  normalize(preprocess(rawResource), customSchema);

export {
  collection,
  manifest,
  canvas,
  annotation,
  annotationPage,
  annotationCollection,
  range,
  contentResource,
  choice,
  canvasReference,
  service,
  partOf,
  annotationBody,
  rangeItem,
  RESOURCE_TYPE_MAP,
  resource,
  preprocess,
  normalizeResource as normalize,
};
