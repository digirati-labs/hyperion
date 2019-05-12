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

  test('scale at origin', () => {
    const points = new Float32Array([1, 0, 0, 1000, 1000]);

    expect(transform(points, scaleAtOrigin(2, 500, 500))).toEqual(new Float32Array([1, -500, -500, 1500, 1500]));
  });

  test('hidePointsOutsideRegion', () => {
    const points = DnaFactory.grid(2, 2)
      .row(f => f.addBox(0, 0, 100, 100).addBox(0, 100, 100, 100))
      .row(f => f.addBox(100, 0, 100, 100).addBox(100, 100, 100, 100))
      .build();

    const hiddenPoints = hidePointsOutsideRegion(points, { x1: 0, x2: 150, y1: 0, y2: 50 });

    expect(filterPoints(hiddenPoints).length).toEqual(10);

    expect(filterPoints(hiddenPoints)).toEqual(
      DnaFactory.grid(2, 1)
        .addBox(0, 0, 100, 100)
        .addBox(100, 0, 100, 100)
        .build()
    );
  });
});
