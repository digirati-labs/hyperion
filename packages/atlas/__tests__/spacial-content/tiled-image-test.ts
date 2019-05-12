import { TiledImage } from '../../src/spacial-content';
import { DnaFactory } from '../../src';

describe('TiledImage', () => {
  test('it can construct', () => {
    const image = TiledImage.fromTile(
      'https://example.org/tiled-image',
      { width: 100, height: 200 },
      { width: 50, height: 50 },
      1
    );

    expect(image.points).toEqual(
      DnaFactory.grid(2, 4)
        .row(r => r.addBox(0, 0, 50, 50).addBox(50, 0, 50, 50))
        .row(r => r.addBox(0, 50, 50, 50).addBox(50, 50, 50, 50))
        .row(r => r.addBox(0, 100, 50, 50).addBox(50, 100, 50, 50))
        .row(r => r.addBox(0, 150, 50, 50).addBox(50, 150, 50, 50))
        .build()
    );
    expect(image.display.scale).toEqual(1);
  });
});
