import { Collection } from '../types/resources/collection';
import { Manifest } from '../types/resources/manifest';
import { Required } from '../types/utility';
import { Canvas } from '../types/resources/canvas';
import { AnnotationPage } from '../types/resources/annotationPage';
import { Annotation, ChoiceBody, ChoiceTarget } from '../types/resources/annotation';
import { ContentResource } from '../types/resources/contentResource';
import { Range, RangeItems } from '../types/resources/range';
import { Service } from '../types/resources/service';

type Traversal<T> = (jsonLd: T) => T;
// type Reducer<T> = (jsonLd: T, action: any) => T;

type TraversalMap = {
  collection?: Array<Traversal<Collection>>;
  manifest?: Array<Traversal<Manifest>>;
  canvas?: Array<Traversal<Canvas>>;
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
  | 'Service';

export const types: TraversableEntityTypes[] = [
  'Collection',
  'Manifest',
  'Canvas',
  'AnnotationPage',
  'AnnotationCollection',
  'Annotation',
  'ContentResource',
  'Range',
  'Service',
];

export function identifyResource(resource: any): TraversableEntityTypes {
  if (typeof resource === 'undefined' || resource === null) {
    throw new Error('Null or undefined is not a valid entity.');
  }
  if (Array.isArray(resource)) {
    throw new Error('Array is not a valid entity');
  }
  if (typeof resource !== 'object') {
    throw new Error(`${typeof resource} is not a valid entity`);
  }

  if (typeof resource!.type === 'string') {
    const hasType = types.indexOf(resource.type);
    if (hasType !== -1) {
      return types[hasType];
    }
  }

  if (resource!.profile) {
    return 'Service';
  }

  throw new Error('Resource type is not known');
}

export class Traverse {
  private traversals: Required<TraversalMap>;

  constructor(traversals: TraversalMap) {
    this.traversals = {
      collection: [],
      manifest: [],
      canvas: [],
      annotationPage: [],
      annotation: [],
      contentResource: [],
      choice: [],
      range: [],
      service: [],
      ...traversals,
    };
  }

  static all(traversal: (resource: any) => any) {
    return new Traverse({
      collection: [traversal],
      manifest: [traversal],
      canvas: [traversal],
      annotationPage: [traversal],
      annotation: [traversal],
      contentResource: [traversal],
      choice: [traversal],
      range: [traversal],
      service: [traversal],
    });
  }

  traverseCollectionItems(collection: Collection): Collection {
    collection.items.map((collectionOrManifest: Manifest | Collection) => {
      if (collectionOrManifest.type === 'Collection') {
        return this.traverseCollection(collectionOrManifest as Collection);
      }
      return this.traverseManifest(collectionOrManifest as Manifest);
    });

    return collection;
  }

  traverseCollection(collection: Collection): Collection {
    return this.traverseType<Collection>(this.traverseCollectionItems(collection), this.traversals.collection);
  }

  traverseManifestItems(manifest: Manifest): Manifest {
    manifest.items = manifest.items.map(canvas => this.traverseCanvas(canvas));
    return manifest;
  }

  traverseManifestStructures(manifest: Manifest): Manifest {
    if (manifest.structures) {
      manifest.structures = manifest.structures.map(range => this.traverseRange(range));
    }
    return manifest;
  }

  traverseManifest(manifest: Manifest): Manifest {
    return this.traverseType<Manifest>(
      this.traverseManifestStructures(this.traverseManifestItems(manifest)),
      this.traversals.manifest
    );
  }

  traverseCanvasItems(canvas: Canvas): Canvas {
    canvas.items = (canvas.items || []).map(
      (annotationPage: AnnotationPage): AnnotationPage => {
        return this.traverseAnnotationPage(annotationPage);
      }
    );

    return canvas;
  }

  traverseCanvas(canvas: Canvas): Canvas {
    return this.traverseType<Canvas>(this.traverseCanvasItems(canvas), this.traversals.canvas);
  }

  traverseAnnotationPageItems(annotationPage: AnnotationPage): AnnotationPage {
    if (annotationPage.items) {
      annotationPage.items = annotationPage.items.map(
        (annotation: Annotation): Annotation => {
          return this.traverseAnnotation(annotation);
        }
      );
    }
    return annotationPage;
  }

  traverseAnnotationPage(annotationPageJson: AnnotationPage): AnnotationPage {
    return this.traverseType<AnnotationPage>(
      this.traverseAnnotationPageItems(annotationPageJson),
      this.traversals.annotationPage
    );
  }

  traverseAnnotationBody(annotation: Annotation): Annotation {
    if (Array.isArray(annotation.body)) {
      annotation.body = annotation.body.map(
        (annotationBody: ContentResource): ContentResource => {
          return this.traverseContentResource(annotationBody);
        }
      );
    } else if (annotation.body) {
      annotation.body = this.traverseContentResource(annotation.body);
    }

    return annotation;
  }
  traverseAnnotationTarget(annotation: Annotation): Annotation {
    if (Array.isArray(annotation.target)) {
      annotation.target = annotation.target.map(
        (annotationBody: ContentResource): ContentResource => {
          return this.traverseContentResource(annotationBody);
        }
      );
    } else if (annotation.target) {
      annotation.target = this.traverseContentResource(annotation.target);
    }

    return annotation;
  }

  traverseAnnotation(annotationJson: Annotation): Annotation {
    return this.traverseType<Annotation>(
      this.traverseAnnotationTarget(this.traverseAnnotationBody(annotationJson)),
      this.traversals.annotation
    );
  }

  traverseContentResource(contentResourceJson: ContentResource): ContentResource {
    return this.traverseType<ContentResource>(contentResourceJson, this.traversals.contentResource);
  }

  traverseRangeRanges(range: Range): Range {
    if (range.items) {
      range.items = range.items.map((rangeOrManifest: RangeItems) => {
        if (typeof rangeOrManifest === 'string') {
          return this.traverseCanvas({ id: rangeOrManifest, type: 'Canvas' });
        }
        if (rangeOrManifest.type === 'Manifest') {
          return this.traverseManifest(rangeOrManifest as Manifest);
        }
        return this.traverseRange(rangeOrManifest as Range);
      });
    }

    return range;
  }

  traverseRange(range: Range): Range {
    return this.traverseType<Range>(this.traverseRangeRanges(range), this.traversals.range);
  }

  traverseType<T>(object: T, traversals: Array<Traversal<T>>): T {
    return traversals.reduce((acc: T, traversal: Traversal<T>): T => {
      return traversal(acc);
    }, object);
  }

  traverseService(service: Service): Service {
    return this.traverseType<Service>(service, this.traversals.service);
  }

  traverseUnknown(resource: any) {
    const type = identifyResource(resource);

    switch (type) {
      case 'Collection':
        return this.traverseCollection(resource as Collection);
      case 'Manifest':
        return this.traverseManifest(resource as Manifest);
      case 'Canvas':
        return this.traverseCanvas(resource as Canvas);
      case 'AnnotationPage':
        return this.traverseAnnotationPage(resource as AnnotationPage);
      case 'Annotation':
        return this.traverseAnnotation(resource as Annotation);
      case 'ContentResource':
        return this.traverseContentResource(resource as ContentResource);
      case 'Range':
        return this.traverseRange(resource as Range);
      case 'Service':
        return this.traverseService(resource as Service);
      default:
        throw new Error(`Unknown or unsupported resource type of ${type}`);
    }
  }
}
