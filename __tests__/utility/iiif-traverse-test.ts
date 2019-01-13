import { Traverse } from '../../src/utility/iiif-traverse';
import { Manifest } from '../../src';
import { Canvas } from '../../src/types/resources/canvas';

describe('utility/iiif-traverse', () => {
  const manifest: Manifest = {
    '@context': ['http://www.w3.org/ns/anno.jsonld', 'http://iiif.io/api/presentation/{{ page.major }}/context.json'],
    id: 'https://example.org/iiif/book1/manifest',
    type: 'Manifest',
    label: { en: ['Image 1'] },
    items: [
      {
        id: 'https://example.org/iiif/book1/canvas/p1',
        type: 'Canvas',
        height: 1800,
        width: 1200,
        items: [
          {
            id: 'https://example.org/iiif/book1/page/p1/1',
            type: 'AnnotationPage',
            items: [
              {
                id: 'https://example.org/iiif/book1/annotation/p0001-image',
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
                  type: 'Image',
                  format: 'image/png',
                  height: 1800,
                  width: 1200,
                },
                target: 'https://example.org/iiif/book1/canvas/p1',
              },
            ],
          },
        ],
      },
    ],
  };

  test('it can traverse simple manifest', () => {
    const canvasList: string[] = [];
    const annotationList: string[] = [];
    const traversal = new Traverse({
      canvas: [
        currentCanvas => {
          canvasList.push(currentCanvas.id);
          return currentCanvas;
        },
      ],
      annotation: [
        currentAnnotation => {
          annotationList.push(currentAnnotation.id);
          return currentAnnotation;
        },
      ],
    });

    traversal.traverseManifest(manifest);

    expect(canvasList).toEqual(['https://example.org/iiif/book1/canvas/p1']);
    expect(annotationList).toEqual(['https://example.org/iiif/book1/annotation/p0001-image']);
  });

  test('it can deference manifests canvases', () => {
    const canvasMap: { [id: string]: Canvas } = {};
    const traversal = new Traverse({
      canvas: [
        currentCanvas => {
          canvasMap[currentCanvas.id] = currentCanvas;
          return { id: currentCanvas.id, type: 'Canvas' };
        },
      ],
    });

    const newManifest = traversal.traverseManifest(manifest);

    expect(newManifest.items).toEqual([
      {
        id: 'https://example.org/iiif/book1/canvas/p1',
        type: 'Canvas',
      },
    ]);
  });

  test('it can traverse all', () => {
    const ids: string[] = [];
    const traversal = Traverse.all(
      (resource: any): any => {
        if (resource.id) {
          ids.push(resource.id);
        }
        return resource;
      }
    );

    traversal.traverseManifest(manifest);

    expect(ids).toEqual([
      'https://example.org/iiif/book1/manifest',
      'https://example.org/iiif/book1/canvas/p1',
      'https://example.org/iiif/book1/page/p1/1',
      'https://example.org/iiif/book1/annotation/p0001-image',
      'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
    ]);
  });
});
