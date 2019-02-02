import { normalize } from '../../src/utility/iiif-normalize';
import { Manifest } from '../../src';

describe('utility/normalize', () => {
  const manifest = (): Manifest => ({
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
  });

  test('it can normalize a simple manifest', () => {
    const result = normalize(manifest());

    expect(result.entities).toEqual({
      Annotation: {
        'https://example.org/iiif/book1/annotation/p0001-image': {
          body: {
            id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
            type: 'ContentResource',
          },
          id: 'https://example.org/iiif/book1/annotation/p0001-image',
          motivation: 'painting',
          target: { id: 'https://example.org/iiif/book1/canvas/p1', type: 'ContentResource' },
          type: 'Annotation',
        },
      },
      AnnotationCollection: {},
      AnnotationPage: {
        'https://example.org/iiif/book1/page/p1/1': {
          id: 'https://example.org/iiif/book1/page/p1/1',
          items: [{ id: 'https://example.org/iiif/book1/annotation/p0001-image', type: 'Annotation' }],
          type: 'AnnotationPage',
        },
      },
      Canvas: {
        'https://example.org/iiif/book1/canvas/p1': {
          height: 1800,
          id: 'https://example.org/iiif/book1/canvas/p1',
          items: [{ id: 'https://example.org/iiif/book1/page/p1/1', type: 'AnnotationPage' }],
          type: 'Canvas',
          width: 1200,
        },
      },
      Collection: {},
      ContentResource: {
        'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png': {
          format: 'image/png',
          height: 1800,
          id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
          type: 'Image',
          width: 1200,
        },
        'https://example.org/iiif/book1/canvas/p1': {
          id: 'https://example.org/iiif/book1/canvas/p1',
          type: 'ContentResource',
        },
      },
      Manifest: {
        'https://example.org/iiif/book1/manifest': {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/{{ page.major }}/context.json',
          ],
          id: 'https://example.org/iiif/book1/manifest',
          items: [{ id: 'https://example.org/iiif/book1/canvas/p1', type: 'Canvas' }],
          label: { en: ['Image 1'] },
          type: 'Manifest',
        },
      },
      Range: {},
      Service: {},
    });

    expect(result.mapping).toEqual({
      'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png': 'ContentResource',
      'https://example.org/iiif/book1/annotation/p0001-image': 'Annotation',
      'https://example.org/iiif/book1/canvas/p1': 'Canvas',
      'https://example.org/iiif/book1/manifest': 'Manifest',
      'https://example.org/iiif/book1/page/p1/1': 'AnnotationPage',
    });

    expect(result.resource).toEqual({ id: 'https://example.org/iiif/book1/manifest', type: 'Manifest' });
  });
});
