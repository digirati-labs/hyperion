import iiifCollection from '../../fixtures/presentation-2/iiif-fixture-collection.json';
import iiifManifest from '../../fixtures/presentation-2/iiif-fixture-manifest.json';
import bibManifest from '../../fixtures/presentation-2/biblissima-manifest.json';
import iiifAnnoList from '../../fixtures/presentation-2/iiif-fixture-annotation-list.json';
import { Traverse } from '../../packages/presentation-2-parser/src/traverse';
import { upgraderTraverse } from '../../packages/presentation-2-parser/src/upgrader';

describe('Presentation 2 Traverse', () => {
  // test('upgrade 2 to 3', () => {
  //   const result = upgraderTraverse.traverseManifest(bibManifest as any);
  //
  //   expect(result).toEqual({});
  // });

  test('traverse simple collection', () => {
    const ids = [];
    const manifestIds = [];
    const traverse = new Traverse({
      collection: [
        collection => {
          ids.push(collection['@id']);
          return collection;
        },
      ],
      manifest: [
        manifest => {
          manifestIds.push(manifest['@id']);
        },
      ],
    });

    traverse.traverseCollection(iiifCollection);

    expect(ids).toEqual(['http://iiif.io/api/presentation/2.1/example/fixtures/collection.json']);
    expect(manifestIds.length).toEqual(55);
  });

  test('traverse simple manifest', () => {
    const ids = [];
    function trackId(type: string) {
      return (item: any) => {
        ids.push({ id: item['@id'], type });
      };
    }
    const traverse = new Traverse({
      manifest: [trackId('manifest')],
      sequence: [trackId('sequence')],
      canvas: [trackId('canvas')],
      contentResource: [trackId('contentResource')],
      annotation: [trackId('annotation')],
    });

    traverse.traverseManifest(iiifManifest);

    expect(ids).toEqual([
      {
        id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
        type: 'contentResource',
      },
      {
        // No id, but it traversed it.
        type: 'annotation',
      },
      {
        id: 'http://iiif.io/api/presentation/2.1/example/fixtures/canvas/1/c1.json',
        type: 'canvas',
      },
      {
        // No id, but it traversed it.
        type: 'sequence',
      },
      {
        id: 'http://iiif.io/api/presentation/2.1/example/fixtures/1/manifest.json',
        type: 'manifest',
      },
    ]);
  });
});
