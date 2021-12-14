import { CollectionNormalized } from './resources/collection';
import { ManifestNormalized } from './resources/manifest';
import { CanvasNormalized } from './resources/canvas';
import { AnnotationPageNormalized } from './resources/annotationPage';
import { AnnotationCollection, AnnotationCollectionNormalized } from './resources/annotationCollection';
import { AnnotationNormalized, Selector } from './resources/annotation';
import { ContentResource } from './resources/contentResource';
import { RangeNormalized } from './resources/range';
import { ServiceNormalized } from './resources/service';
import { TraversableEntityTypes } from './traversal';

export type NormalizedEntity =
  | CollectionNormalized
  | ManifestNormalized
  | CanvasNormalized
  | AnnotationPageNormalized
  | AnnotationCollectionNormalized
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

export type EntityMapping = {
  [id: string]: TraversableEntityTypes;
};

export type RequestState = {
  [id: string]: {
    loadingState: 'RESOURCE_ERROR' | 'RESOURCE_LOADING' | 'RESOURCE_READY';
    uriMismatch: boolean;
    requestUri: string;
    resourceUri: string;
    error?: string;
  };
};

export type MetaState = Record<string, Record<string, Record<string, any>>>;

export type EntityStore<Meta extends MetaState = MetaState> = {
  entities: Entities;
  mapping: EntityMapping;
  requests: RequestState;
  meta: Meta;
};

export type HyperionStore<Meta extends MetaState = MetaState> = {
  hyperion: EntityStore<Meta>;
};
