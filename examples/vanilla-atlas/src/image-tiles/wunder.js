import { ImageService } from '@hyperion-framework/atlas';

export default {
  id: 'https://dlcs.io/thumbs/2/1/ff2085d5-a9c7-412e-9dbe-dda87712228d',
  width: 2569,
  height: 3543,
  layers: ImageService.fromContentResource({
    id: 'https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg',
    type: 'Image',
    format: 'image/jpeg',
    height: 1868,
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
  }),
}
