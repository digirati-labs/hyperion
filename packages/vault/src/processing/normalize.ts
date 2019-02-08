import { TraversableEntityTypes, Traverse } from './traverse';
import {
  Annotation,
  AnnotationCollection,
  AnnotationPage,
  AnnotationPageNormalized,
  Canvas,
  CanvasNormalized,
  Collection,
  CollectionNormalized,
  ContentResource,
  Manifest,
  ManifestNormalized,
  RangeNormalized,
  Selector,
  Service,
  Range,
  ServiceNormalized,
} from '@hyperion-framework/types';
import { emptyCollection } from '../resources/collection';
import { emptyManifest } from '../resources/manifest';
import { emptyCanvas } from '../resources/canvas';
import { emptyAnnotationPage } from '../resources/annotationPage';
import { emptyRange } from '../resources/range';
import { emptyService } from '../resources/service';

export type Entities = {
  Collection: {
    [id: string]: CollectionNormalized;
  };
  Manifest: {
    [id: string]: ManifestNormalized;
  };
  Canvas: {
    [id: string]: CanvasNormalized;
  };
  AnnotationPage: {
    [id: string]: AnnotationPageNormalized;
  };
  AnnotationCollection: {
    [id: string]: AnnotationCollection;
  };
  Annotation: {
    [id: string]: Annotation;
  };
  ContentResource: {
    [id: string]: ContentResource;
  };
  Range: {
    [id: string]: RangeNormalized;
  };
  Service: {
    [id: string]: ServiceNormalized;
  };
  Selector: {
    [id: string]: Selector;
  };
};

export type Mapping = {
  [id: string]: TraversableEntityTypes;
};

export const defaultEntities: Entities = {
  Collection: {},
  Manifest: {},
  Canvas: {},
  AnnotationPage: {},
  AnnotationCollection: {},
  Annotation: {},
  ContentResource: {},
  Range: {},
  Service: {},
  Selector: {},
};

export type EntityReference = { id?: string; type?: string };
export type PolyEntity = EntityReference | string;

function getResource(entityOrString: PolyEntity, type: string): EntityReference {
  if (typeof entityOrString === 'string') {
    return { id: entityOrString, type };
  }
  if (!entityOrString.id) {
    throw new Error(`Invalid resource does not have an ID (${type})`);
  }
  return entityOrString as EntityReference;
}

function mapToEntities(entities: Entities) {
  return <T extends EntityReference | string>(type: TraversableEntityTypes) => {
    const storeType = entities[type] ? entities[type] : {};
    return (r: T): T => {
      const resource = getResource(r, type);
      if (resource && resource.id && type) {
        storeType[resource.id] = storeType[resource.id]
          ? Object.assign({}, storeType[resource.id], resource)
          : Object.assign({}, resource);
        return { id: resource.id, type: type } as T;
      }
      return resource as T;
    };
  };
}

function recordTypeInMapping(mapping: Mapping) {
  return <T extends EntityReference | string>(type: TraversableEntityTypes) => {
    return (r: T): T => {
      const { id } = getResource(r, type);
      if (typeof id === 'undefined') {
        throw new Error('Found invalid entity without an ID.');
      }
      mapping[id] = type;
      return r;
    };
  };
}

/**
 * A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
 * @author MatthewBarker <mrjbarker@hotmail.com>
 */
function hash(object: any): string {
  const text = JSON.stringify(object);

  let hash = 5381,
    index = text.length;

  while (index) {
    hash = (hash * 33) ^ text.charCodeAt(--index);
  }

  const num = hash >>> 0;

  const hexString = num.toString(16);
  if (hexString.length % 2) {
    return '0' + hexString;
  }
  return hexString;
}

function addMissingIdToContentResource<T extends EntityReference>(type: string) {
  return (resource: T | string): T => {
    if (typeof resource === 'string') {
      return { id: resource, type } as T;
    }
    if (!resource.id) {
      return { id: hash(resource), type, ...resource };
    }
    if (!resource.type) {
      return { type, ...resource };
    }
    return resource;
  };
}

function ensureDefaultFields<T, R>(defaultResource: R) {
  return (resource: T): R => {
    return {
      ...defaultResource,
      ...resource,
    };
  };
}

// @todo Plan for tomorrow.
//    - [x] Wrap head around normalized types.
//    - [x] Fully implement Normalized resources (all fields)
//    - [ ] Start working on selector API (steal from IIIF Redux)
//    - [ ] Create a thumbnail generator
//    - [ ] Get tiles parsed, taken from IIIF image matrix
//    - [ ] Get first Vanilla implementation done
//    - [ ] Expand traversal to linking properties
//    - [ ] Get a proof of concept to dereference resources
//    - [ ] Create React bindings (hooks only)
//    - [ ] Create Vue bindings
//    - [ ] Implement Search
//    - [ ] Implement Auth
//    - [ ] Get list of pattern matching required
//    - [ ] Get Open annotation to W3C converter created

export function normalize(entity: unknown) {
  const entities: Entities = { ...defaultEntities };
  const mapping: Mapping = {};
  const addToEntities = mapToEntities(entities);
  const addToMapping = recordTypeInMapping(mapping);
  const traversal = new Traverse({
    collection: [
      ensureDefaultFields<Collection, CollectionNormalized>(emptyCollection),
      addToMapping<Collection>('Collection'),
      addToEntities<Collection>('Collection'),
    ],
    manifest: [
      ensureDefaultFields<Manifest, ManifestNormalized>(emptyManifest),
      addToMapping<Manifest>('Manifest'),
      addToEntities<Manifest>('Manifest'),
    ],
    canvas: [
      ensureDefaultFields<Canvas, CanvasNormalized>(emptyCanvas),
      addToMapping<Canvas>('Canvas'),
      addToEntities<Canvas>('Canvas'),
    ],
    annotationPage: [
      addMissingIdToContentResource('AnnotationPage'),
      ensureDefaultFields<AnnotationPage, AnnotationPageNormalized>(emptyAnnotationPage),
      addToMapping<AnnotationPage>('AnnotationPage'),
      addToEntities<AnnotationPage>('AnnotationPage'),
    ],
    annotation: [
      // This won't be normalized before going into the state.
      // It will be normalized through selectors and pattern matching.
      addMissingIdToContentResource('Annotation'),
      addToMapping<Annotation>('Annotation'),
      addToEntities<Annotation>('Annotation'),
    ],
    contentResource: [
      // This won't be normalized before going into the state.
      // It will be normalized through selectors and pattern matching.
      addMissingIdToContentResource('ContentResource'),
      addToMapping<ContentResource>('ContentResource'),
      addToEntities<ContentResource>('ContentResource'),
    ],
    range: [
      // This will add a LOT to the state, maybe this will be configurable down the line.
      ensureDefaultFields<Range, RangeNormalized>(emptyRange),
      addToMapping<Range>('Range'),
      addToEntities<Range>('Range'),
    ],
    service: [
      ensureDefaultFields<Service, ServiceNormalized>(emptyService),
      addToMapping<Service>('Service'),
      addToEntities<Service>('Service'),
    ],
  });
  const resource = traversal.traverseUnknown(entity) as EntityReference;

  return { entities, resource, mapping };
}
