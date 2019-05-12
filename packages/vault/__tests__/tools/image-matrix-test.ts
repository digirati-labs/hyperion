import { CELL_LENGTH, createMatrix, PaintableImage, PaintableTileSource, translateX, World } from '../../src/tools/image-matrix';

describe('createMatrix', () => {
  // test('image', () => {
  //   const t = createMatrix({
  //     canvas: {width: 1000, height: 1000, originX: 0, originY: 0},
  //     tile: {width: 100, height: 100, scale: 1},
  //   });
  //
  //   expect(t).toEqual([]);
  // })

  describe('World', () => {
    test('createMatrix 4x4 tile - perfect fit', () => {
      const t = createMatrix({
        canvas: { width: 100, height: 100 },
        tile: { width: 50, height: 50, scale: 1 },
      });

      // // Row 1
      expect(t.subarray(0, 5)).toEqual(new Int16Array([1, 0, 0, 50, 50]));
      expect(t.subarray(5, 10)).toEqual(new Int16Array([1, 50, 0, 100, 50]));
      // // Row 2
      expect(t.subarray(10, 15)).toEqual(new Int16Array([1, 0, 50, 50, 100]));
      expect(t.subarray(15, 20)).toEqual(new Int16Array([1, 50, 50, 100, 100]));
    });

    test('createMatrix 4x4 tile - non-perfect fit', () => {
      const t = createMatrix({
        canvas: { width: 80, height: 70 },
        tile: { width: 50, height: 50, scale: 1 },
      });

      // Row 1
      expect(t.subarray(0, 5)).toEqual(new Int16Array([1, 0, 0, 50, 50]));
      expect(t.subarray(6, 10)).toEqual(new Int16Array([50, 0, 80, 50]));
      // Row 2
      expect(t.subarray(11, 15)).toEqual(new Int16Array([0, 50, 50, 70]));
      expect(t.subarray(16, 20)).toEqual(new Int16Array([50, 50, 80, 70]));
    });

    test('simple world from resource', () => {
      const world = World.fromResources([
        {
          id: '1',
          width: 100,
          height: 300,
          layers: [new PaintableImage('image-1', { width: 100, height: 300 })],
        },
      ]);

      expect(world.width).toEqual(100);
      expect(world.height).toEqual(300);

      expect(world.resources[0].x).toEqual(0);
      expect(world.resources[0].y).toEqual(0);
      expect(world.resources[0].width).toEqual(100);
      expect(world.resources[0].height).toEqual(300);
    });

    test('simple world from resources', () => {
      const world = World.fromResources([
        {
          id: '1',
          width: 100,
          height: 300,
          layers: [new PaintableImage('image-1', { width: 100, height: 300 })],
        },
        {
          id: '2',
          width: 100,
          height: 300,
          layers: [new PaintableImage('image-2', { width: 100, height: 300 })],
        },
        {
          id: '3',
          width: 100,
          height: 310,
          layers: [new PaintableImage('image-3', { width: 100, height: 310 })],
        },
      ]);

      expect(world.width).toEqual(300);
      expect(world.height).toEqual(310);

      expect(world.resources[0].x).toEqual(0);
      expect(world.resources[0].y).toEqual(0);
      expect(world.resources[0].width).toEqual(100);
      expect(world.resources[0].height).toEqual(300);

      expect(world.resources[1].x).toEqual(100);
      expect(world.resources[1].y).toEqual(0);
      expect(world.resources[1].width).toEqual(100);
      expect(world.resources[1].height).toEqual(300);

      expect(world.resources[2].x).toEqual(200);
      expect(world.resources[2].y).toEqual(0);
      expect(world.resources[2].width).toEqual(100);
      expect(world.resources[2].height).toEqual(310);
    });

    test('world with margin', () => {
      const world = World.fromResources(
        [
          {
            id: '1',
            width: 100,
            height: 300,
            layers: [new PaintableImage('image-1', { width: 100, height: 300 })],
          },
          {
            id: '2',
            width: 100,
            height: 300,
            layers: [new PaintableImage('image-2', { width: 100, height: 300 })],
          },
          {
            id: '3',
            width: 100,
            height: 310,
            layers: [new PaintableImage('image-3', { width: 100, height: 310 })],
          },
        ],
        { margin: 40 }
      );

      expect(world.width).toEqual(380);
      expect(world.height).toEqual(390);

      expect(world.resources[0].x).toEqual(40);
      expect(world.resources[0].y).toEqual(40);
      expect(world.resources[0].width).toEqual(100);
      expect(world.resources[0].height).toEqual(300);

      expect(world.resources[1].x).toEqual(140);
      expect(world.resources[1].y).toEqual(40);
      expect(world.resources[1].width).toEqual(100);
      expect(world.resources[1].height).toEqual(300);

      expect(world.resources[2].x).toEqual(240);
      expect(world.resources[2].y).toEqual(40);
      expect(world.resources[2].width).toEqual(100);
      expect(world.resources[2].height).toEqual(310);
    });

    test('world with spacing', () => {
      const world = World.fromResources(
        [
          {
            id: '1',
            width: 100,
            height: 300,
            layers: [new PaintableImage('image-1', { width: 100, height: 300 })],
          },
          {
            id: '2',
            width: 100,
            height: 300,
            layers: [new PaintableImage('image-2', { width: 100, height: 300 })],
          },
          {
            id: '3',
            width: 100,
            height: 310,
            layers: [new PaintableImage('image-2', { width: 100, height: 310 })],
          },
        ],
        { spacing: 40 }
      );

      expect(world.width).toEqual(380);
      expect(world.height).toEqual(310);

      expect(world.resources[0].x).toEqual(0);
      expect(world.resources[0].y).toEqual(0);
      expect(world.resources[0].width).toEqual(100);
      expect(world.resources[0].height).toEqual(300);

      expect(world.resources[1].x).toEqual(140);
      expect(world.resources[1].y).toEqual(0);
      expect(world.resources[1].width).toEqual(100);
      expect(world.resources[1].height).toEqual(300);

      expect(world.resources[2].x).toEqual(280);
      expect(world.resources[2].y).toEqual(0);
      expect(world.resources[2].width).toEqual(100);
      expect(world.resources[2].height).toEqual(310);
    });

    test('world renderings', () => {
      const world = World.fromResources(
        [
          {
            id: '1',
            width: 100,
            height: 300,
            layers: [new PaintableImage('image-1', { width: 100, height: 300 })],
          },
          {
            id: '2',
            width: 100,
            height: 300,
            layers: [
              new PaintableTileSource('tile', { width: 100, height: 100, scale: 1 }, { width: 300, height: 100 }),
            ],
          },
          {
            id: '3',
            width: 100,
            height: 300,
            layers: [
              new PaintableTileSource('tile', { width: 100, height: 100, scale: 1 }, { width: 300, height: 100 }),
            ],
          },
          {
            id: '4',
            width: 100,
            height: 300,
            layers: [
              new PaintableTileSource('tile', { width: 100, height: 100, scale: 1 }, { width: 300, height: 100 }),
            ],
          },
        ],
        { spacing: 40 }
      );

      expect(world.width).toEqual(520);
      expect(world.height).toEqual(300);

      expect(world.getRenderables()).toEqual([
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-1',
          points: new Int16Array([1, 0, 0, 100, 300]),
          type: 'image',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 100, 1, 100, 0, 200, 100, 1, 200, 0, 300, 100]),
          displayScale: 1,
          id: 'tile--1',
          points: new Int16Array([1, 140, 0, 240, 100, 1, 240, 0, 340, 100, 1, 340, 0, 440, 100]),
          type: 'tile-source',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 100, 1, 100, 0, 200, 100, 1, 200, 0, 300, 100]),
          displayScale: 1,
          id: 'tile--1',
          points: new Int16Array([1, 280, 0, 380, 100, 1, 380, 0, 480, 100, 1, 480, 0, 580, 100]),
          type: 'tile-source',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 100, 1, 100, 0, 200, 100, 1, 200, 0, 300, 100]),
          displayScale: 1,
          id: 'tile--1',
          points: new Int16Array([1, 420, 0, 520, 100, 1, 520, 0, 620, 100, 1, 620, 0, 720, 100]),
          type: 'tile-source',
        },
      ]);

      expect(world.getRenderables(translateX(100))).toEqual([
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-1',
          points: new Int16Array([1, 100, 0, 200, 300]),
          type: 'image',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 100, 1, 100, 0, 200, 100, 1, 200, 0, 300, 100]),
          displayScale: 1,
          id: 'tile--1',
          points: new Int16Array([1, 240, 0, 340, 100, 1, 340, 0, 440, 100, 1, 440, 0, 540, 100]),
          type: 'tile-source',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 100, 1, 100, 0, 200, 100, 1, 200, 0, 300, 100]),
          displayScale: 1,
          id: 'tile--1',
          points: new Int16Array([1, 380, 0, 480, 100, 1, 480, 0, 580, 100, 1, 580, 0, 680, 100]),
          type: 'tile-source',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 100, 1, 100, 0, 200, 100, 1, 200, 0, 300, 100]),
          displayScale: 1,
          id: 'tile--1',
          points: new Int16Array([1, 520, 0, 620, 100, 1, 620, 0, 720, 100, 1, 720, 0, 820, 100]),
          type: 'tile-source',
        },
      ]);
    });

    test('world renderings - groupings', () => {
      const world = World.fromResources([
        {
          id: '1',
          width: 1000,
          height: 3000,
          layers: [
            new PaintableTileSource('tile-1', { width: 100, height: 100, scale: 1 }, { width: 300, height: 100 }),
            new PaintableTileSource('tile-1', { width: 100, height: 100, scale: 2 }, { width: 300, height: 100 }),
            new PaintableTileSource('tile-1', { width: 100, height: 100, scale: 3 }, { width: 300, height: 100 }),
          ],
        },
      ]);

      world.setGroup('tile-1', ['tile-1--2']);

      expect(world.width).toEqual(1000);
      expect(world.height).toEqual(3000);

      expect(world.getRenderables()).toEqual([
        {
          displayPoints: new Int16Array([2, 0, 0, 200, 100, 2, 200, 0, 300, 100]),
          displayScale: 2,
          id: 'tile-1--2',
          points: new Int16Array([2, 0, 0, 200, 100, 2, 200, 0, 300, 100]),
          type: 'tile-source',
        },
      ]);
    });

    test('world renderings - projection', () => {
      const world = World.fromResources([
        {
          id: '1',
          width: 100,
          height: 300,
          layers: [new PaintableImage('image-1', { width: 100, height: 300 })],
        },
        {
          id: '2',
          width: 100,
          height: 300,
          layers: [new PaintableImage('image-2', { width: 100, height: 300 })],
        },
        {
          id: '3',
          width: 100,
          height: 300,
          layers: [new PaintableImage('image-3', { width: 100, height: 300 })],
        },
      ]);

      expect(world.width).toEqual(300);
      expect(world.height).toEqual(300);

      // Show every image framed in the viewport.
      expect(world.getRenderablesFromProjection({ x1: 0, x2: 300, y1: 300, y2: 300 })).toEqual([
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-1',
          points: new Int16Array([1, 0, 0, 100, 300]),
          type: 'image',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-2',
          points: new Int16Array([1, 100, 0, 200, 300]),
          type: 'image',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-3',
          points: new Int16Array([1, 200, 0, 300, 300]),
          type: 'image',
        },
      ]);

      // Between first and second image
      expect(world.getRenderablesFromProjection({ x1: 50, x2: 150, y1: 0, y2: 300 })).toEqual([
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-1',
          points: new Int16Array([1, 0, 0, 100, 300]),
          type: 'image',
        },
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-2',
          points: new Int16Array([1, 100, 0, 200, 300]),
          type: 'image',
        },
      ]);

      // // Our viewport is going to be the second image only.
      expect(world.getRenderablesFromProjection({ x1: 101, x2: 199, y1: 0, y2: 300 })).toEqual([
        {
          displayPoints: new Int16Array([1, 0, 0, 100, 300]),
          displayScale: 1,
          id: 'image-2',
          points: new Int16Array([1, 100, 0, 200, 300]),
          type: 'image',
        },
      ]);
    });
  });

  describe('PaintableTileSource', () => {
    test('can create individual tile sources', () => {
      const tileSource1 = new PaintableTileSource(
        'https://some-image-serivce/',
        {
          height: 100,
          width: 100,
          scale: 1,
        },
        { width: 1000, height: 1000 }
      );

      expect(tileSource1.points.length).toEqual(CELL_LENGTH * 10 * 10);

      const tileSource2 = new PaintableTileSource(
        'https://some-image-serivce/',
        {
          height: 100,
          width: 100,
          scale: 2,
        },
        { width: 1000, height: 1000 }
      );

      expect(tileSource2.points.length).toEqual(CELL_LENGTH * 5 * 5);

      const tileSource3 = new PaintableTileSource(
        'https://some-image-serivce/',
        {
          height: 100,
          width: 100,
          scale: 4,
        },
        { width: 1000, height: 1000 }
      );

      expect(tileSource3.points.length).toEqual(CELL_LENGTH * 3 * 3);

      const tileSource4 = new PaintableTileSource(
        'https://some-image-serivce/',
        {
          height: 100,
          width: 100,
          scale: 8,
        },
        { width: 1000, height: 1000 }
      );

      expect(tileSource4.points.length).toEqual(CELL_LENGTH * 2 * 2);
    });

    test('can create from image service', () => {
      const tileSources = PaintableTileSource.fromImageService(
        {
          id: 'http://some-image-service',
          tiles: [{ width: 256, scaleFactors: [1, 2, 4] }],
          width: 1000,
          height: 1000,
          protocol: 'http://iiif.io/api/image',
          profile: ['http://iiif.io/api/image/2/level2.json'],
        },
        { width: 1000, height: 1000 }
      );

      expect(tileSources.length).toEqual(3);

      expect(tileSources[0].group).toEqual('http://some-image-service');
      expect(tileSources[1].group).toEqual('http://some-image-service');
      expect(tileSources[2].group).toEqual('http://some-image-service');

      expect(tileSources[0].id).toEqual('http://some-image-service--1');
      expect(tileSources[1].id).toEqual('http://some-image-service--2');
      expect(tileSources[2].id).toEqual('http://some-image-service--4');

      expect(tileSources[0].points.length).toEqual(CELL_LENGTH * 4 * 4);
      expect(tileSources[1].points.length).toEqual(CELL_LENGTH * 2 * 2);
      expect(tileSources[2].points.length).toEqual(CELL_LENGTH * 1 * 1);
    });
  });

  describe('tile source end to end', () => {
    const imageSerivce = {
      id: 'https://view.nls.uk/iiif/7443/74438561.5',
      protocol: 'http://iiif.io/api/image',
      width: 2500,
      height: 1868,
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
    };
    const canvas = { id: 'https://view.nls.uk/iiif/7446/74464117/canvas/1', width: 2500, height: 1868 };

    const world = World.fromResources([
      { ...canvas, layers: PaintableTileSource.fromImageService(imageSerivce, canvas) },
    ]);

    const render = world.getRenderablesFromProjection({ x1: 0, x2: 2500, y1: 0, y2: 1868 });

    expect(render.length).toEqual(5);
    expect(render[0].points.length).toEqual(400);
    expect(render[1].points.length).toEqual(100);
    expect(render[2].points.length).toEqual(30);
    expect(render[3].points.length).toEqual(10);
    expect(render[4].points.length).toEqual(5);
  });
});
