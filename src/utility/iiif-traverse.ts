import { Collection } from '../types/resources/collection';
import { Manifest } from '../types/resources/manifest';
import { Required } from '../types/utility';
import { Canvas } from '../types/resources/canvas';
import { AnnotationPage } from '../types/resources/annotationPage';
import { Annotation, ChoiceBody, ChoiceTarget } from '../types/resources/annotation';
import { ContentResource } from '../types/resources/contentResource';

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
};

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
    });
  }

  traverseCollection(collectionJson: Collection): Collection {
    const collection = this.traverseType(collectionJson, this.traversals.collection);

    const items = collection.items.map((collectionOrManifest: Manifest | Collection) => {
      if (collectionOrManifest.type === 'Collection') {
        return this.traverseCollection(collectionOrManifest as Collection);
      }
      return this.traverseManifest(collectionOrManifest as Manifest);
    });

    return { ...collection, items };
  }

  traverseManifest(manifestJson: Manifest): Manifest {
    const manifest = this.traverseType(manifestJson, this.traversals.manifest);

    const items = manifest.items.map(canvas => this.traverseCanvas(canvas));

    return { ...manifest, items };
  }

  traverseCanvas(canvasJson: Canvas): Canvas {
    const canvas = this.traverseType(canvasJson, this.traversals.canvas);

    if (!canvas.items) {
      return canvas;
    }

    const items = canvas.items.map(
      (annotationPage: AnnotationPage): AnnotationPage => {
        return this.traverseAnnotationPage(annotationPage);
      }
    );

    return { ...canvas, items };
  }

  traverseAnnotationPage(annotationPageJson: AnnotationPage): AnnotationPage {
    const annotationPage = this.traverseType(annotationPageJson, this.traversals.annotationPage);
    const toAdd: { items?: Annotation[] } = {};

    if (annotationPage!.items) {
      toAdd.items = (annotationPage!.items || []).map(
        (annotation: Annotation): Annotation => {
          return this.traverseAnnotation(annotation);
        }
      );
    }

    return { ...annotationPage, ...toAdd };
  }

  traverseAnnotation(annotationJson: Annotation): Annotation {
    const annotation = this.traverseType(annotationJson, this.traversals.annotation);
    const toAdd: {
      body?: ContentResource[] | ContentResource;
      target?: ContentResource[] | ContentResource;
    } = {};

    if (Array.isArray(annotation.body)) {
      toAdd.body = annotation.body.map(
        (annotationBody: ContentResource): ContentResource => {
          return this.traverseContentResource(annotationBody);
        }
      );
    } else if (annotation.body) {
      toAdd.body = this.traverseContentResource(annotation.body);
    }

    if (Array.isArray(annotation.target)) {
      toAdd.target = annotation.target.map(
        (annotationBody: ContentResource): ContentResource => {
          return this.traverseContentResource(annotationBody);
        }
      );
    } else if (annotation.target) {
      toAdd.target = this.traverseContentResource(annotation.target);
    }

    return { ...annotation, ...toAdd };
  }

  traverseContentResource(contentResourceJson: ContentResource): ContentResource {
    return this.traverseType<ContentResource>(contentResourceJson, this.traversals.contentResource);
  }

  traverseType<T>(object: T, traversals: Array<Traversal<T>>): T {
    return traversals.reduce((acc: T, traversal: Traversal<T>): T => {
      return traversal(acc);
    }, object);
  }
}
