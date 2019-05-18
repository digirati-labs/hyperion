import { emptyCanvas } from '@hyperion-framework/vault';
import { fromCanvas } from '../src/world-objects';
import { ImageService, SingleImage, TiledImage } from '../src/spacial-content';

describe('World object', () => {
  test('Basic canvas', () => {
    const worldObject = fromCanvas(
      {
        ...emptyCanvas,
        id: 'https://example.org/canvas/1.json',
        width: 2356,
        height: 4502,
      },
      [
        {
          id: 'https://dlcs.io/iiif-img/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d/full/!1024,1024/0/default.jpg',
          type: 'Image',
          format: 'image/jpeg',
          width: 2356,
          height: 4502,
          service: [
            {
              '@context': 'http://iiif.io/api/image/2/context.json',
              id: 'https://dlcs.io/iiif-img/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d',
              profile: 'http://iiif.io/api/image/2/level1.json',
            },
          ],
        },
        {
          id: 'https://dlcs.io/iiif-img/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d/full/!1024,1024/0/default.jpg',
          type: 'Image',
          format: 'image/jpeg',
          height: 1024,
          width: 742,
          service: [
            {
              '@context': 'http://iiif.io/api/image/2/context.json',
              id: 'https://dlcs.io/iiif-img/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d',
              protocol: 'http://iiif.io/api/image',
              width: 2569,
              height: 3543,
              tiles: [
                {
                  width: 256,
                  height: 256,
                  scaleFactors: [1, 2, 4, 8, 16],
                },
              ],
              sizes: [
                {
                  width: 725,
                  height: 1000,
                },
                {
                  width: 290,
                  height: 400,
                },
                {
                  width: 145,
                  height: 200,
                },
                {
                  width: 73,
                  height: 100,
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
        },
      ]
    );

    expect(worldObject.scale).toEqual(1);
    expect(worldObject.width).toEqual(2356);
    expect(worldObject.height).toEqual(4502);
    expect(worldObject.layers.length).toEqual(2);
    expect((worldObject.layers[0] as SingleImage).points.length).toEqual(5);
    expect((worldObject.layers[1] as ImageService).points.length).toEqual(5);
    expect((worldObject.layers[1] as ImageService<TiledImage>).images.length).toEqual(5);
  });
});
