import { ImageService } from '@hyperion-framework/atlas';

export default {
  id: 'https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg',
  width: 2500,
  height: 1869,
  layers: ImageService.fromContentResource({
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
  }),
};
