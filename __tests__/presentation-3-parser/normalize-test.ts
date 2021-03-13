import { normalize } from '../../packages/parser/src/normalize';

import manifestFixture from '../../fixtures/2-to-3-converter/manifests/iiif.io__api__presentation__2.1__example__fixtures__1__manifest.json';

describe('normalize', () => {
  test('normalize simple manifest', () => {
    const db = normalize(manifestFixture);

    expect(db.mapping).toMatchInlineSnapshot(`
      Object {
        "http://iiif.io/api/presentation/2.1/example/fixtures/1/manifest.json": "Manifest",
        "http://iiif.io/api/presentation/2.1/example/fixtures/canvas/1/c1.json": "Canvas",
        "http://iiif.io/api/presentation/2.1/example/fixtures/collection.json": "ContentResource",
        "http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png": "ContentResource",
        "https://example.org/uuid/1dad04b3-79c6-4a97-a831-634f2ee50a26": "AnnotationPage",
        "https://example.org/uuid/3644c005-bf7a-48d0-9fa9-1e1757bf8df1": "Annotation",
      }
    `);
  });
});
