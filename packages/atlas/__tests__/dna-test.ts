import {
  compose,
  invert,
  translate,
  scale,
  transform,
  scaleAtOrigin,
  DnaFactory,
  hidePointsOutsideRegion,
  filterPoints,
  getIntersection,
} from '../src/dna';

describe('dna', () => {
  test('matrix transforms', () => {
    const points = new Float32Array([1, 0, 0, 1000, 1000]);

    expect(transform(points, translate(100, 0))).toEqual(new Float32Array([1, 100, 0, 1100, 1000]));

    expect(transform(points, scale(2))).toEqual(new Float32Array([1, 0, 0, 2000, 2000]));

    // t r s
    const scaleAndTranslate = compose(
      translate(100, 150),
      scale(2)
    );

    const translatedPoints = transform(points, scaleAndTranslate);

    expect(translatedPoints).toEqual(new Float32Array([1, 100, 150, 2100, 2150]));

    const invertedScaleAndTranslate = invert(scaleAndTranslate);

    expect(transform(translatedPoints, invertedScaleAndTranslate)).toEqual(new Float32Array([1, 0, 0, 1000, 1000]));
  });

  describe('DnaFactory', () => {
    test('overflow', () => {
      expect(() =>
        DnaFactory.grid()
          .addBox(0, 0, 100, 100)
          .addBox(0, 0, 100, 100)
          .build()
      ).toThrowError('Source is too large');
    });
    test('incomplete strand', () => {
      expect(() =>
        DnaFactory.grid(5, 5)
          .addBox(0, 0, 100, 100)
          .addBox(0, 0, 100, 100)
          .build()
      ).toThrowError('Incomplete strand. 2 of 25');
    });
    test('point creation', () => {
      expect(DnaFactory.point(100, 40)).toEqual(new Float32Array([1, 100, 40, 100, 40]));
    });
  });

  describe('compose', () => {
    test('invalid compose should throw error (left side)', () => {
      expect(() =>
        compose(
          new Float32Array([0, 1, 2]),
          scale(1)
        )
      ).toThrowError('Transforms must be Mat3 as Float32Array');
    });

    test('invalid compose should throw error (right side)', () => {
      expect(() =>
        compose(
          scale(1),
          new Float32Array([0, 1, 2])
        )
      ).toThrowError('Transforms must be Mat3 as Float32Array');
    });

    test('invalid compose should throw error (both sides)', () => {
      expect(() =>
        compose(
          new Float32Array([0, 1, 2]),
          new Float32Array([0, 1, 2])
        )
      ).toThrowError('Transforms must be Mat3 as Float32Array');
    });
  });

  test('scale at origin', () => {
    const points = new Float32Array([1, 0, 0, 1000, 1000]);

    expect(transform(points, scaleAtOrigin(2, 500, 500))).toEqual(new Float32Array([1, -500, -500, 1500, 1500]));
  });

  describe('hidePointsOutsideRegion', () => {
    test('4x4 grid, only top left should show', () => {
      const points = DnaFactory.grid(2, 2)
        .row(f => f.addBox(0, 0, 100, 100).addBox(0, 100, 100, 100))
        .row(f => f.addBox(100, 0, 100, 100).addBox(100, 100, 100, 100))
        .build();

      const hiddenPoints = hidePointsOutsideRegion(points, DnaFactory.positionPair({ x1: 0, y1: 0, x2: 99, y2: 99 }));

      expect(filterPoints(hiddenPoints)).toEqual(DnaFactory.singleBox(100, 100, 0, 0));
    });

    test('4x4 grid, only top right should show', () => {
      const points = DnaFactory.grid(2, 2)
        .row(f => f.addBox(0, 0, 100, 100).addBox(0, 100, 100, 100))
        .row(f => f.addBox(100, 0, 100, 100).addBox(100, 100, 100, 100))
        .build();

      const hiddenPoints = hidePointsOutsideRegion(points, DnaFactory.singleBox(100, 100, 100, 0));

      expect(filterPoints(hiddenPoints)).toEqual(DnaFactory.singleBox(100, 100, 100, 0));
    });

    test('4x4 grid, only top left 2 should show', () => {
      const points = DnaFactory.grid(2, 2)
        .row(f => f.addBox(0, 0, 100, 100).addBox(0, 100, 100, 100))
        .row(f => f.addBox(100, 0, 100, 100).addBox(100, 100, 100, 100))
        .build();

      const hiddenPoints = hidePointsOutsideRegion(points, DnaFactory.singleBox(100, 200, 0, 0));

      expect(filterPoints(hiddenPoints)).toEqual(
        DnaFactory.grid(1, 2)
          .row(f => f.addBox(0, 0, 100, 100))
          .row(f => f.addBox(0, 100, 100, 100))
          .build()
      );
    });

    test('simple', () => {
      const points = DnaFactory.grid(2, 2)
        .row(f => f.addBox(0, 0, 100, 100).addBox(0, 100, 100, 100))
        .row(f => f.addBox(100, 0, 100, 100).addBox(100, 100, 100, 100))
        .build();

      const hiddenPoints = hidePointsOutsideRegion(points, DnaFactory.positionPair({ x1: 0, x2: 150, y1: 0, y2: 50 }));

      expect(filterPoints(hiddenPoints).length).toEqual(10);

      expect(filterPoints(hiddenPoints)).toEqual(
        DnaFactory.grid(2, 1)
          .addBox(0, 0, 100, 100)
          .addBox(100, 0, 100, 100)
          .build()
      );
    });
  });

  describe('getIntersection', () => {
    test('two similar boxes with intersection along x axis', () => {
      expect(getIntersection(DnaFactory.singleBox(100, 100, 0, 0), DnaFactory.singleBox(100, 100, 50, 0))).toEqual(
        DnaFactory.singleBox(50, 100, 50, 0)
      );
    });

    test('two similar boxes with intersection along y axis', () => {
      expect(getIntersection(DnaFactory.singleBox(100, 100, 0, 0), DnaFactory.singleBox(100, 100, 0, 50))).toEqual(
        DnaFactory.singleBox(100, 50, 0, 50)
      );
    });

    test('two similar boxes with intersection along both axis', () => {
      expect(getIntersection(DnaFactory.singleBox(100, 100, 0, 0), DnaFactory.singleBox(100, 100, 50, 50))).toEqual(
        DnaFactory.singleBox(50, 50, 50, 50)
      );
    });

    test('two dissimilar boxes with intersection', () => {
      expect(getIntersection(DnaFactory.singleBox(200, 100, 0, 0), DnaFactory.singleBox(100, 300, 40, 80))).toEqual(
        DnaFactory.singleBox(100, 20, 40, 80)
      );
    });

    test('two non intersecting boxes', () => {
      expect(getIntersection(DnaFactory.singleBox(100, 100, 0, 0), DnaFactory.singleBox(100, 100, 200, 200))).toEqual(
        new Float32Array([0, 0, 0, 0, 0])
      );
    });
  });
});
