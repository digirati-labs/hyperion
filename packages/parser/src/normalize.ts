import { Traverse } from './traverse';
import {
  Annotation,
  AnnotationPage,
  AnnotationPageNormalized,
  Canvas,
  CanvasNormalized,
  Collection,
  CollectionNormalized,
  Manifest,
  ManifestNormalized,
  RangeNormalized,
  Range,
  Reference,
  PolyEntity,
  Entities,
  TraversableEntityTypes,
  EntityMapping,
} from '@hyperion-framework/types';
import { emptyCollection, emptyAnnotationPage, emptyCanvas, emptyManifest, emptyRange } from './empty-types';
import { convertPresentation2 } from './upgrader';

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

export function getDefaultEntities(): Entities {
  return {
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
}

function getResource(entityOrString: PolyEntity, type: string): Reference {
  if (typeof entityOrString === 'string') {
    return { id: entityOrString, type };
  }
  if (!entityOrString.id) {
    throw new Error(`Invalid resource does not have an ID (${type})`);
  }
  return entityOrString as Reference;
}

function mapToEntities(entities: Entities) {
  return <T extends Reference | string>(type: TraversableEntityTypes) => {
    const storeType = entities[type] ? entities[type] : {};
    return (r: T): T => {
      const resource = getResource(r, type);
      if (resource && resource.id && type) {
        storeType[resource.id] = storeType[resource.id]
          ? (Object.assign({}, storeType[resource.id], resource) as any)
          : Object.assign({}, resource);
        return { id: resource.id, type: type } as T;
      }
      return resource as T;
    };
  };
}

function recordTypeInMapping(mapping: EntityMapping) {
  return <T extends Reference | string>(type: TraversableEntityTypes) => {
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

  let numHash = 5381,
    index = text.length;

  while (index) {
    numHash = (numHash * 33) ^ text.charCodeAt(--index);
  }

  const num = numHash >>> 0;

  const hexString = num.toString(16);
  if (hexString.length % 2) {
    return '0' + hexString;
  }
  return hexString;
}

function addMissingIdToContentResource<T extends Reference>(type: string) {
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

export function normalize(unknownEntity: unknown) {
  const entity = convertPresentation2(unknownEntity);
  const entities: Entities = getDefaultEntities();
  const mapping: EntityMapping = {};
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
      addMissingIdToContentResource<any>('ContentResource'),
      addToMapping<any>('ContentResource'),
      addToEntities<any>('ContentResource'),
    ],
    range: [
      // This will add a LOT to the state, maybe this will be configurable down the line.
      ensureDefaultFields<Range, RangeNormalized>(emptyRange),
      addToMapping<Range>('Range'),
      addToEntities<Range>('Range'),
    ],
    // Remove this, content resources are NOT usually processed by this library.
    // They need to be available in full when they get passed down the chain.
    // There may be a better way to preserve annotations and content resources.
    // service: [
    //   ensureDefaultFields<Service, ServiceNormalized>(emptyService),
    //   addToMapping<Service>('Service'),
    //   addToEntities<Service>('Service'),
    // ],
  });
  const resource = traversal.traverseUnknown(entity) as Reference;

  return { entities, resource, mapping };
}
