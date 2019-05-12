import Upgrader from 'iiif-prezi2to3';
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
  AnnotationNormalized,
} from '@hyperion-framework/types';
import { emptyCollection } from '../resources/collection';
import { emptyManifest } from '../resources/manifest';
import { emptyCanvas } from '../resources/canvas';
import { emptyAnnotationPage } from '../resources/annotationPage';
import { emptyRange } from '../resources/range';
import { emptyService } from '../resources/service';

export type NormalizedEntity =
  | CollectionNormalized
  | ManifestNormalized
  | CanvasNormalized
  | AnnotationPageNormalized
  | AnnotationCollection
  | AnnotationNormalized
  | ContentResource
  | RangeNormalized
  | ServiceNormalized
  | Selector;

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
    [id: string]: AnnotationNormalized;
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

function ensureArray<T>(maybeArray: T | T[]): T[] {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }
  return [maybeArray];
}

function ensureArrayOnAnnotation(annotation: Annotation): Annotation {
  if (annotation.body) {
    annotation.body = ensureArray(annotation.body);
  }
  if (annotation.seeAlso) {
    annotation.seeAlso = ensureArray(annotation.seeAlso);
  }
  if (annotation.body) {
    annotation.body = ensureArray(annotation.body);
  }
  if (annotation.audience) {
    annotation.audience = ensureArray(annotation.audience);
  }
  if (annotation.accessibility) {
    annotation.accessibility = ensureArray(annotation.accessibility);
  }
  if (annotation.motivation) {
    annotation.motivation = ensureArray(annotation.motivation);
  }

  return annotation;
}

export function convertPresentation2<T extends any>(entity: T): T | Manifest | Collection {
  if (
    entity &&
    (entity['@context'] === 'http://iiif.io/api/presentation/2/context.json' ||
      entity['@context'].indexOf('http://iiif.io/api/presentation/2/context.json') !== -1 ||
      // Yale context.
      entity['@context'] === 'http://www.shared-canvas.org/ns/context.json') ||
    entity['@context'] === 'http://iiif.io/api/image/2/context.json'
  ) {
    // Definitely presentation 3
    const type = entity['@type'] || entity.type;
    if (type === 'Manifest' || type === 'sc:Manifest') {
      const upgrade = new Upgrader({ default_lang: 'en', deref_links: false });
      return upgrade.processResource(entity, true);
      // convert manifest.
    }
    if (type === 'Collection' || type === 'sc:Collection') {
      const upgrade = new Upgrader({ default_lang: 'en', deref_links: false });
      return upgrade.processResource(entity, true);
    }
    // Image service.
    if (entity.profile) {
      const upgrade = new Upgrader({ default_lang: 'en', deref_links: false });
      return upgrade.processResource(entity, true);
    }
  }
  return entity;
}

export function normalize(unknownEntity: unknown) {
  const entity = convertPresentation2(unknownEntity);
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
      ensureArrayOnAnnotation,
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
