import hash from 'object-hash';
import { TraversableEntityTypes, Traverse } from './iiif-traverse';
import { Canvas } from '../types/resources/canvas';
import { Collection, Manifest } from '..';
import { AnnotationPage } from '../types/resources/annotationPage';
import { AnnotationCollection } from '../types/resources/annotationCollection';
import { Annotation } from '../types/resources/annotation';
import { ContentResource } from '../types/resources/contentResource';
import { Service } from '../types/resources/service';
import { Range } from '../types/resources/range';

type Entities = {
  Collection: {
    [id: string]: Collection;
  };
  Manifest: {
    [id: string]: Manifest;
  };
  Canvas: {
    [id: string]: Canvas;
  };
  AnnotationPage: {
    [id: string]: AnnotationPage;
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
    [id: string]: Range;
  };
  Service: {
    [id: string]: Service;
  };
};

type Mapping = {
  [id: string]: TraversableEntityTypes;
};

const defaultEntities: Entities = {
  Collection: {},
  Manifest: {},
  Canvas: {},
  AnnotationPage: {},
  AnnotationCollection: {},
  Annotation: {},
  ContentResource: {},
  Range: {},
  Service: {},
};

type EntityReference = { id?: string; type?: string };
type PolyEntity = EntityReference | string;

function getResource(entityOrString: PolyEntity, type: string): EntityReference {
  if (typeof entityOrString === 'string') {
    return { id: entityOrString, type };
  }
  if (!entityOrString.id) {
    throw new Error('Invalid resource does not have an ID');
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

function addMissingIdToContentResource() {
  return (resource: ContentResource): ContentResource => {
    if (typeof resource === 'string') {
      return { id: resource, type: 'ContentResource' } as ContentResource;
    }
    if (!resource.id) {
      return { id: hash(resource), type: 'ContentResource', ...resource };
    }
    if (!resource.type) {
      return { type: 'ContentResource', ...resource };
    }
    return resource;
  };
}

export function normalize(entity: unknown) {
  const entities: Entities = { ...defaultEntities };
  const mapping: Mapping = {};
  const addToEntities = mapToEntities(entities);
  const addToMapping = recordTypeInMapping(mapping);
  const traversal = new Traverse({
    collection: [addToMapping<Collection>('Collection'), addToEntities<Collection>('Collection')],
    manifest: [addToMapping<Manifest>('Manifest'), addToEntities<Manifest>('Manifest')],
    canvas: [addToMapping<Canvas>('Canvas'), addToEntities<Canvas>('Canvas')],
    annotationPage: [addToMapping<AnnotationPage>('AnnotationPage'), addToEntities<AnnotationPage>('AnnotationPage')],
    annotation: [addToMapping<Annotation>('Annotation'), addToEntities<Annotation>('Annotation')],
    contentResource: [
      addMissingIdToContentResource(),
      addToMapping<ContentResource>('ContentResource'),
      addToEntities<ContentResource>('ContentResource'),
    ],
    range: [addToMapping<Range>('Range'), addToEntities<Range>('Range')],
    service: [addToMapping<Service>('Service'), addToEntities<Service>('Service')],
  });
  const resource = traversal.traverseUnknown(entity) as EntityReference;

  return { entities, resource, mapping };
}
