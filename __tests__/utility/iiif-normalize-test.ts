import { Manifest } from '@hyperion-framework/types';
import { normalize } from '@hyperion-framework/vault/src/processing/normalize';

describe('utility/normalize', () => {
  const manifest = (): Manifest => ({
    '@context': ['http://www.w3.org/ns/anno.jsonld', 'http://iiif.io/api/presentation/{{ page.major }}/context.json'],
    id: 'https://example.org/iiif/book1/manifest',
    type: 'Manifest',
    label: { en: ['Image 1'] },
    homepage: 'http://myhomepage.com',
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

    expect(result.entities).toMatchSnapshot();

    expect(result.mapping).toEqual({
      'http://myhomepage.com': 'ContentResource',
      'https://example.org/iiif/book1/annotation/p0001-image': 'Annotation',
      'https://example.org/iiif/book1/canvas/p1': 'Canvas',
      'https://example.org/iiif/book1/manifest': 'Manifest',
      'https://example.org/iiif/book1/page/p1/1': 'AnnotationPage',
    });

    expect(result.resource).toEqual({ id: 'https://example.org/iiif/book1/manifest', type: 'Manifest' });
  });
});
