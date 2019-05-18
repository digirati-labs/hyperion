import { SingleImage } from '../../src/spacial-content';
import { compose, DnaFactory, scale, transform, translate } from '../../src';

describe('SingleImage', () => {
  test('it can construct', () => {
    const image = SingleImage.fromImage('https://example.org/test.jpg', { width: 100, height: 200 });

    expect(image.points).toEqual(new Float32Array([1, 0, 0, 100, 200]));
    expect(image.display.scale).toBe(1);

    expect(image.x).toEqual(0);
    expect(image.y).toEqual(0);
    expect(image.width).toEqual(100);
    expect(image.height).toEqual(200);
  });

  test('it can construct scaled image', () => {
    const image = SingleImage.fromImage(
      'https://example.org/test.jpg',
      { width: 100, height: 200 },
      { width: 50, height: 100 }
    );

    // Display shows the original size
    expect(image.display.points).toEqual(DnaFactory.singleBox(50, 100));
    // Points show the drawn size.
    expect(image.points).toEqual(DnaFactory.singleBox(100, 200));
    expect(image.display.scale).toEqual(2);

    expect(image.x).toEqual(0);
    expect(image.y).toEqual(0);
    expect(image.width).toEqual(100);
    expect(image.height).toEqual(200);

    const [, points] = image.getPointsAt(DnaFactory.projection({ x: 0, y: 0, width: 100, height: 200 }));

    expect(points).toEqual(DnaFactory.singleBox(100, 200));
  });

  test('it will use a default scale', () => {
    const image = new SingleImage({ uri: 'https://example.org/test.jpg', width: 100, height: 100 });
    expect(image.width).toEqual(100);
    expect(image.height).toEqual(100);
  });

  test('custom scale can be set', () => {
    const image = new SingleImage({ uri: 'https://example.org/test.jpg', width: 200, height: 100, scale: 0.2 });
    expect(image.display.width).toEqual(1000);
    expect(image.display.height).toEqual(500);
  });

  test('can be transformed before requesting points', () => {
    const image = SingleImage.fromImage('https://example.org/test.jpg', { width: 250, height: 100 });

    expect(image.points).toEqual(DnaFactory.singleBox(250, 100, 0, 0));

    image.transform(translate(125, 250));

    expect(image.points).toEqual(DnaFactory.singleBox(250, 100, 125, 250));
  });

  test('can be transformed when requesting points', () => {
    const image = SingleImage.fromImage(
      'https://example.org/test.jpg',
      { width: 100, height: 200 },
      { width: 50, height: 100 }
    );

    const [, points, t] = image.getPointsAt(
      DnaFactory.projection({ x: 0, y: 0, width: 100, height: 200 }),
      compose(
        translate(100, 500),
        scale(4)
      )
    );

    expect(points).toEqual(DnaFactory.singleBox(100, 200, 0, 0));
    expect(transform(points, t as Float32Array)).toEqual(DnaFactory.singleBox(400, 800, 100, 500));
  });
});
