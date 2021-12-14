import { Collection, CollectionNormalized } from './resources/collection';
import { Manifest, ManifestNormalized } from './resources/manifest';
import { Canvas, CanvasNormalized } from './resources/canvas';
import { AnnotationCollection } from './resources/annotationCollection';
import { AnnotationPage, AnnotationPageNormalized } from './resources/annotationPage';
import { Annotation, AnnotationNormalized, ChoiceBody, ChoiceTarget, Selector } from './resources/annotation';
import { ContentResource } from './resources/contentResource';
import { Range, RangeNormalized } from './resources/range';
import { Service, ServiceNormalized } from './resources/service';

type Traversal<T> = (jsonLd: T) => Partial<T> | any;

type TraversalMap = {
  collection?: Array<Traversal<Collection>>;
  manifest?: Array<Traversal<Manifest>>;
  canvas?: Array<Traversal<Canvas>>;
  annotationCollection?: Array<Traversal<AnnotationCollection>>;
  annotationPage?: Array<Traversal<AnnotationPage>>;
  annotation?: Array<Traversal<Annotation>>;
  contentResource?: Array<Traversal<ContentResource>>;
  choice?: Array<Traversal<ChoiceTarget | ChoiceBody>>;
  range?: Array<Traversal<Range>>;
  service?: Array<Traversal<Service>>;
};

export type TraversableEntityTypes =
  | 'Collection'
  | 'Manifest'
  | 'Canvas'
  | 'AnnotationPage'
  | 'AnnotationCollection'
  | 'Annotation'
  | 'ContentResource'
  | 'Range'
  | 'Service'
  | 'Selector';

export type TraversableEntity =
  | Collection
  | Manifest
  | Canvas
  | AnnotationPage
  | AnnotationCollection
  | Annotation
  | ContentResource
  | Range
  | Service
  | Selector;

export type TraversableEntityMap = {
  Collection: Collection;
  Manifest: Manifest;
  Canvas: Canvas;
  AnnotationPage: AnnotationPage;
  AnnotationCollection: AnnotationCollection;
  Annotation: Annotation;
  ContentResource: ContentResource;
  Range: Range;
  Service: Service;
  Selector: Selector;
};

export type TraversableEntityMappedType<T extends TraversableEntityTypes> = T extends 'Collection'
  ? CollectionNormalized
  : T extends 'Manifest'
  ? ManifestNormalized
  : T extends 'Canvas'
  ? CanvasNormalized
  : T extends 'AnnotationPage'
  ? AnnotationPageNormalized
  : T extends 'AnnotationCollection'
  ? AnnotationCollection
  : T extends 'Annotation'
  ? AnnotationNormalized
  : T extends 'ContentResource'
  ? ContentResource
  : T extends 'Range'
  ? RangeNormalized
  : T extends 'Service'
  ? ServiceNormalized
  : Selector;
