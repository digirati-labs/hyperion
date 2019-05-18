import { ImageService, SingleImage, TiledImage } from '../../src/spacial-content';
import { DnaFactory, filterPoints } from '../../src';

describe('ImageService', () => {
  describe('ImageService.fromContentResource', () => {
    test('it can create from content resource without service', () => {
      const service = ImageService.fromContentResource({
        id: 'https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg',
        type: 'Image',
        format: 'image/jpeg',
        height: 1868,
        width: 2500,
      });
      expect(service).toEqual([
        SingleImage.fromImage('https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg', {
          width: 2500,
          height: 1868,
        }),
      ]);
    });
    test('it can construct from NLS example', () => {
      const service = ImageService.fromContentResource({
        id: 'https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg',
        type: 'Image',
        format: 'image/jpeg',
        height: 1868,
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
        width: 2500,
      });

      expect(service.length).toEqual(1);
      expect(service[0].points.length).toEqual(5);
      expect((service[0] as ImageService<TiledImage>).images.length).toEqual(5);
      expect(service[0]).toBeInstanceOf(ImageService);
      expect((service[0] as ImageService<TiledImage>).images[0].points.length).toEqual(400);
      expect((service[0] as ImageService<TiledImage>).images[1].points.length).toEqual(100);
      expect((service[0] as ImageService<TiledImage>).images[2].points.length).toEqual(30);
      expect((service[0] as ImageService<TiledImage>).images[3].points.length).toEqual(10);
      expect((service[0] as ImageService<TiledImage>).images[4].points.length).toEqual(5);

      const [paintable, points] = service[0].getPointsAt(
        DnaFactory.projection({ x: 0, y: 0, width: 500, height: 500 })
      );

      expect(points.length).toEqual(400);
      expect(paintable).toStrictEqual((service[0] as ImageService<TiledImage>).images[0]);
      expect(filterPoints(points).length).toEqual(5 * 2 * 2);
      expect((paintable as TiledImage).getImageUrl(0)).toEqual(
        'https://view.nls.uk/iiif/7443/74438562.5/0,0,256,256/256,256/0/default.jpg'
      );

      const lastPointIndex = (paintable.display.points.length - 5) / 5;
      const images = [];
      for (let i = 0; i < lastPointIndex; i++) {
        images.push((paintable as TiledImage).getImageUrl(i));
      }
      expect(images).toEqual([
        'https://view.nls.uk/iiif/7443/74438562.5/0,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,0,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2304,0,196,256/196,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/0,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,256,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2304,256,196,256/196,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/0,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,512,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2304,512,196,256/196,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/0,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,768,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2304,768,196,256/196,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/0,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,1024,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2304,1024,196,256/196,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/0,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,1280,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2304,1280,196,256/196,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/0,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,1536,256,256/256,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2304,1536,196,256/196,256/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/0,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/256,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/512,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/768,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1024,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1280,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1536,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/1792,1792,256,77/256,77/0/default.jpg',
        'https://view.nls.uk/iiif/7443/74438562.5/2048,1792,256,77/256,77/0/default.jpg',
      ]);
    });
  });
});
