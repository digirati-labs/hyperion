import { ImageService, SingleImage } from '../src/spacial-content';
import { World } from '../src/world';
import { DnaFactory } from '../src';

describe('World', () => {
  test('making a world', () => {
    const world = new World(1000, 1000);

    world.addObjectAt(
      {
        id: 'http://example.org/test-1.jpg',
        width: 100,
        height: 100,
        layers: [SingleImage.fromImage('http://example.org/test-1.jpg', { width: 100, height: 100 })],
      },
      { x: 0, y: 0, width: 100, height: 100 }
    );

    world.addObjectAt(
      {
        id: 'http://example.org/test-2.jpg',
        width: 100,
        height: 100,
        layers: [
          new ImageService({
            height: 100,
            width: 100,
            images: [
              SingleImage.fromImage('http://example.org/test-2-big.jpg', { width: 100, height: 100 }),
              SingleImage.fromImage(
                'http://example.org/test-2-smol.jpg',
                { width: 100, height: 100 },
                { width: 50, height: 50 }
              ),
            ],
            id: 'http://example.org/test-2.jpg',
          }),
        ],
      },
      { x: 101, y: 0, width: 100, height: 100 }
    );

    const objects = world.getObjects();

    expect(objects.length).toEqual(2);

    // @todo rewrite these tests once the API is stable.
    // expect(objects[0].x).toEqual(0);
    // expect(objects[0].y).toEqual(0);
    //
    // expect(objects[1].x).toEqual(101);
    // expect(objects[1].y).toEqual(0);
    //
    // const paint1 = world.getPointsAt({ x: 0, y: 0, width: 50, height: 50, scale: 1 });
    // expect(paint1.length).toEqual(1);
    // expect(paint1[0][1]).toEqual(DnaFactory.singleBox(100, 100, 0, 0));
    //
    // const paint2 = world.getPointsAt({ x: 101, y: 0, width: 50, height: 50, scale: 1 });
    // expect(paint2.length).toEqual(1);
    // expect(paint2[0][1]).toEqual(DnaFactory.singleBox(100, 100, 0, 0));
    //
    // const paint3 = world.getPointsAt({ x: 101, y: 0, width: 50, height: 50, scale: 2 });
    // expect(paint3.length).toEqual(1);
    // expect(paint3[0][0].id).toEqual('http://example.org/test-2-smol.jpg');
    // expect(paint3[0][1]).toEqual(DnaFactory.singleBox(100, 100, 0, 0));
    //
    // const paint4 = world.getPointsAt({ x: 101, y: 50, width: 50, height: 50, scale: 2 });
    // expect(paint4.length).toEqual(1);
    // expect(paint4[0][0].id).toEqual('http://example.org/test-2-smol.jpg');
    // expect(transform(paint4[0][1], paint4[0][2] as Float32Array)).toEqual(DnaFactory.singleBox(200, 200, 0, -100));

    // @todo move pointToCanvas to util.
    // expect(paint4[0].pointToCanvas(30, 60)).toEqual(DnaFactory.point(15, 80));
    // expect(paint4[0].pointToCanvas(0, 0)).toEqual(DnaFactory.point(0, 50));
  });

  test('making a tiled world', () => {
    const world = new World(5000, 1000);

    const tile1 = world.addObjectAt(
      {
        id: 'https://view.nls.uk/iiif/7443/74438561.5/',
        height: 1868,
        width: 2500,
        layers: ImageService.fromContentResource({
          id: 'https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg',
          type: 'Image',
          format: 'image/jpeg',
          height: 1868,
          width: 2500,
          service: [
            {
              '@context': 'http://iiif.io/api/image/2/context.json',
              id: 'https://view.nls.uk/iiif/7443/74438562.5',
              protocol: 'http://iiif.io/api/image',
              width: 2500,
              height: 1869,
              tiles: [
                {
                  width: 256,
                  height: 256,
                  scaleFactors: [1, 2, 4, 8, 16],
                },
              ],
              profile: [
                'http://iiif.io/api/image/2/level1.json',
                {
                  formats: ['jpg'],
                  qualities: ['native', 'color', 'gray'],
                  supports: [
                    'regionByPct',
                    'sizeByForcedWh',
                    'sizeByWh',
                    'sizeAboveFull',
                    'rotationBy90s',
                    'mirroring',
                    'gray',
                  ],
                },
              ],
            },
          ],
        }),
      },
      { x: 0, y: 0, height: 1000 }
    );

    const tile2 = world.addObjectAt(
      {
        id: 'https://view.nls.uk/iiif/7443/74438562.5/',
        height: 1869,
        width: 2500,
        layers: ImageService.fromContentResource({
          id: 'https://view.nls.uk/iiif/7443/74438562.5/full/full/0/native.jpg',
          type: 'Image',
          format: 'image/jpeg',
          height: 1869,
          width: 2500,
          service: [
            {
              '@context': 'http://iiif.io/api/image/2/context.json',
              id: 'https://view.nls.uk/iiif/7443/74438562.5',
              protocol: 'http://iiif.io/api/image',
              width: 2500,
              height: 1869,
              tiles: [
                {
                  width: 256,
                  height: 256,
                  scaleFactors: [1, 2, 4, 8, 16],
                },
              ],
              profile: [
                'http://iiif.io/api/image/2/level1.json',
                {
                  formats: ['jpg'],
                  qualities: ['native', 'color', 'gray'],
                  supports: [
                    'regionByPct',
                    'sizeByForcedWh',
                    'sizeByWh',
                    'sizeAboveFull',
                    'rotationBy90s',
                    'mirroring',
                    'gray',
                  ],
                },
              ],
            },
          ],
        }),
      },
      { x: tile1.width + 100, y: 0, height: 1000 }
    );

    // Tile 1.
    expect(tile1.id).toEqual('https://view.nls.uk/iiif/7443/74438561.5/');
    expect(tile1.x).toEqual(0);
    expect(tile1.y).toEqual(0);
    expect(tile1.width).toBeCloseTo(1338.33);
    expect(tile1.height).toBeCloseTo(1000);

    // Tile 2.
    expect(tile2.id).toEqual('https://view.nls.uk/iiif/7443/74438562.5/');
    expect(tile2.x).toBeCloseTo(1438.33);
    expect(tile2.y).toEqual(0);
    expect(tile2.width).toBeCloseTo(1337.61);
    expect(tile2.height).toBeCloseTo(1000);

    expect(world.getPoints().slice(0, 10)).toEqual(
      //       [1, 0, 0, 1338.3297119140625, 1000, 1, 2600, 0, 3937.61376953125, 1000]
      DnaFactory.grid(1, 2)
        .addBox(0, 0, 1338.3297119140625, 1000)
        .addBox(1438.3297119140625, 0, 1337.613769531, 1000.0000610351562)
        .build()
    );
  });
});
