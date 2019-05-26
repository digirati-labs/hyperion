import {
  canonicalServiceUrl,
  fixedSizesFromScales,
  getCustomSizeFromService,
  getFixedSizeFromImage,
  getFixedSizesFromService,
  getImageCandidates,
  getImageServerFromId,
  getSmallestScaleFactorAsSingleImage,
  inferSizeFromUrl,
  isImageService,
  pickBestFromCandidates,
  sizesMatch,
  supportsCustomSizes,
} from '../../src/image-api/utility';
import { ImageServiceLoader } from '../../src/image-api/image-service-loader';
import { ImageCandidate } from '../../src/image-api/types';

describe('image utilities', () => {
  describe('sizesMatch', () => {
    test('lengths dont match - early exit check', () => {
      expect(sizesMatch([], [{ height: 100, width: 120 }])).toEqual(false);
      expect(sizesMatch([{ height: 100, width: 120 }], [])).toEqual(false);
    });

    test('lengths dont match - same values, in same order', () => {
      expect(sizesMatch([{ height: 100, width: 120 }], [{ height: 100, width: 120 }])).toEqual(true);
    });

    test('lengths match, sizes different', () => {
      expect(sizesMatch([{ height: 100, width: 100 }], [{ width: 200, height: 200 }])).toEqual(false);
    });

    test('same sizes, out of order', () => {
      expect(
        sizesMatch(
          [{ height: 100, width: 150 }, { height: 200, width: 300 }, { height: 300, width: 450 }],
          [{ height: 300, width: 450 }, { height: 200, width: 300 }, { height: 100, width: 150 }]
        )
      ).toEqual(true);
    });

    test('out of order, but some different', () => {
      expect(
        sizesMatch(
          [{ height: 100, width: 150 }, { height: 200, width: 300 }, { height: 300, width: 500 }],
          [{ height: 300, width: 450 }, { height: 200, width: 300 }, { height: 100, width: 150 }]
        )
      ).toEqual(false);
    });
  });

  describe('fixedSizesFromScales', () => {
    test('matches list of scale', () => {
      expect(fixedSizesFromScales(1024, 2048, [2, 4, 8])).toEqual([
        { height: 1024, width: 512 },
        { height: 512, width: 256 },
        { height: 256, width: 128 },
      ]);
    });
  });

  describe('getFixedSizeFromImage', () => {
    test('unknown case - string', () => {
      expect(getFixedSizeFromImage('http://example.org/image.jpg')).toEqual({
        id: 'http://example.org/image.jpg',
        type: 'unknown',
      });
    });

    test('not an iamge', () => {
      expect(getFixedSizeFromImage({ id: 'http://example.org/audio.mp3', type: 'Sound' })).toEqual(null);
    });

    test('no id provided, invalid image but valid content resource.. technically', () => {
      expect(getFixedSizeFromImage({ type: 'Image', value: 'some textual value' })).toEqual(null);
    });

    test('almost an image, but no dimensions', () => {
      expect(
        getFixedSizeFromImage({
          id: 'http://example.org/image.jpg',
          type: 'Image',
        })
      ).toEqual({
        type: 'unknown',
        id: 'http://example.org/image.jpg',
      });

      expect(
        getFixedSizeFromImage({
          id: 'http://example.org/image.jpg',
          width: 1000,
          type: 'Image',
        })
      ).toEqual({
        type: 'unknown',
        id: 'http://example.org/image.jpg',
      });

      expect(
        getFixedSizeFromImage({
          id: 'http://example.org/image.jpg',
          height: 1000,
          type: 'Image',
        })
      ).toEqual({
        type: 'unknown',
        id: 'http://example.org/image.jpg',
      });
    });

    test('image with enough information to be an image', () => {
      expect(
        getFixedSizeFromImage({ id: 'http://example.org/image.jpg', type: 'Image', width: 1000, height: 2000 })
      ).toEqual({
        id: 'http://example.org/image.jpg',
        type: 'fixed',
        width: 1000,
        height: 2000,
      });
    });
  });

  describe('getFixedSizesFromService', () => {
    test('no service', () => {
      expect(
        getFixedSizesFromService({
          id: 'http://example.org/service1.json',
          profile: 'some-profile',
        })
      ).toEqual([]);
    });

    test('simple service with size', () => {
      expect(
        getFixedSizesFromService({
          id: 'http://example.org/service1.json',
          profile: 'level2',
          sizes: [{ width: 1024, height: 2048 }],
        })
      ).toEqual([{ height: 2048, id: 'http://example.org/service1.json', type: 'fixed-service', width: 1024 }]);
    });

    test('simple service with multiple sizes', () => {
      expect(
        getFixedSizesFromService({
          id: 'http://example.org/service1.json',
          profile: 'level2',
          sizes: [{ width: 1024, height: 2048 }, { width: 512, height: 1024 }],
        })
      ).toEqual([
        { height: 2048, id: 'http://example.org/service1.json', type: 'fixed-service', width: 1024 },
        { height: 1024, id: 'http://example.org/service1.json', type: 'fixed-service', width: 512 },
      ]);
    });
  });

  describe('canonicalServiceUrl', () => {
    test('already canonical', () => {
      expect(canonicalServiceUrl('http://example.org/image-1/info.json')).toEqual(
        'http://example.org/image-1/info.json'
      );
    });

    test('trailing slash', () => {
      expect(canonicalServiceUrl('http://example.org/image-1/')).toEqual('http://example.org/image-1/info.json');
    });

    test('no trailing slash', () => {
      expect(canonicalServiceUrl('http://example.org/image-1')).toEqual('http://example.org/image-1/info.json');
    });

    describe('getImageServerFromId', () => {
      test('already a server', () => {
        expect(getImageServerFromId('example.org')).toEqual('example.org');
      });

      test('server with protocol, which gets stripped off', () => {
        expect(getImageServerFromId('https://example.org')).toEqual('example.org');
      });

      test('server wit path', () => {
        expect(getImageServerFromId('https://example.org/some-image/something/here.json')).toEqual('example.org');
      });
    });
  });

  describe('supportsCustomSizes', () => {
    test('non image services', () => {
      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: 'not-image-service',
        })
      ).toEqual(false);
    });

    test('IIIF image service profile', () => {
      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: 'level1',
        })
      ).toEqual(true);

      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: 'level2',
        })
      ).toEqual(true);
    });

    test('level 0 image service should not work', () => {
      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: 'level0',
        })
      ).toEqual(false);
    });

    test('level 0 with extras should work', () => {
      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', { supports: ['regionByPx', 'sizeByW'] }],
        })
      ).toEqual(true);

      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', { supports: ['regionByPx', 'sizeByWh'] }],
        })
      ).toEqual(true);

      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', { supports: ['regionByPx', 'sizeByWh', 'sizeByW'] }],
        })
      ).toEqual(true);
    });

    test('level 0 with extras but not enough', () => {
      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', { supports: ['regionByPx'] }],
        })
      ).toEqual(false);

      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', { supports: ['sizeByWh'] }],
        })
      ).toEqual(false);

      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', { supports: ['sizeByWh', 'sizeByW'] }],
        })
      ).toEqual(false);

      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', { supports: ['sizeByW'] }],
        })
      ).toEqual(false);

      expect(
        supportsCustomSizes({
          id: 'http://example.org/service/1',
          profile: ['level0', {}],
        })
      ).toEqual(false);
    });
  });

  describe('getCustomSizeFromService', () => {
    test('not an image service', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: 'not-an-image-service',
        })
      ).toEqual([]);
    });

    test('an image service without custom sizes', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: 'level0',
        })
      ).toEqual([]);
    });

    test('an image service with custom sizes', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: 'level0',
          sizes: [{ width: 100, height: 200 }, { width: 200, height: 400 }],
        })
      ).toEqual([]);
    });

    test('an image service with scales', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: 'level1',
          tiles: [{ width: 256, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([
        {
          id: 'http://example.org/service/1',
          maxHeight: 256,
          maxWidth: 256,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('an image service with scales', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: 'level1',
          tiles: [{ width: 256, height: 512, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([
        {
          id: 'http://example.org/service/1',
          maxHeight: 512,
          maxWidth: 256,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('an image service with scales', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: ['level1', {}],
          tiles: [{ width: 256, height: 512, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([
        {
          id: 'http://example.org/service/1',
          maxHeight: 512,
          maxWidth: 256,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('an image service with invalid tile', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: ['level1'],
          tiles: [{ width: 0, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([]);
    });

    test('an image service without tiles (invalid)', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: ['level1'],
        })
      ).toEqual([]);
    });

    test('an image service with scales + maxWidth', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: ['level1', { maxWidth: 1000 }],
          tiles: [{ width: 256, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([
        {
          id: 'http://example.org/service/1',
          maxHeight: 1000,
          maxWidth: 1000,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('an image service with scales + maxHeight', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: ['level1', { maxHeight: 1000 }],
          tiles: [{ width: 256, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([
        {
          id: 'http://example.org/service/1',
          maxHeight: 1000,
          maxWidth: 1000,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('an image service ith both maxHeight + maxWidth', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: ['level1', { maxHeight: 1000, maxWidth: 2000 }],
          tiles: [{ width: 256, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([
        {
          id: 'http://example.org/service/1',
          maxHeight: 1000,
          maxWidth: 2000,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('an image service ith both maxHeight + maxWidth', () => {
      expect(
        getCustomSizeFromService({
          id: 'http://example.org/service/1',
          profile: ['level1', { maxHeight: 1000, maxWidth: 2000 }],
          tiles: [{ width: 256, height: 512, scaleFactors: [1, 2, 4, 8] }],
        })
      ).toEqual([
        {
          id: 'http://example.org/service/1',
          maxHeight: 1000,
          maxWidth: 2000,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });
  });

  describe('getSmallestScaleFactorAsSingleImage', () => {
    test('no height or width', () => {
      expect(
        getSmallestScaleFactorAsSingleImage({
          id: 'http://example.org/service/1',
          profile: 'level1',
        })
      ).toEqual(null);

      expect(
        getSmallestScaleFactorAsSingleImage({
          id: 'http://example.org/service/1',
          profile: 'level1',
          width: 1000,
        })
      ).toEqual(null);

      expect(
        getSmallestScaleFactorAsSingleImage({
          id: 'http://example.org/service/1',
          profile: 'level1',
          height: 1000,
        })
      ).toEqual(null);
    });

    test('simple tiles - but too large', () => {
      expect(
        getSmallestScaleFactorAsSingleImage({
          id: 'http://example.org/service/1',
          profile: 'level1',
          height: 1024,
          width: 2048,
          tiles: [{ width: 256, scaleFactors: [1, 2, 3, 4] }],
        })
      ).toEqual(null);
    });

    test('simple tiles', () => {
      expect(
        getSmallestScaleFactorAsSingleImage({
          id: 'http://example.org/service/1',
          profile: 'level1',
          height: 1024,
          width: 2048,
          tiles: [{ width: 256, scaleFactors: [1, 2, 3, 4, 8] }],
        })
      ).toEqual({ height: 128, id: 'http://example.org/service/1', type: 'fixed-service', width: 256 });
    });

    test('invalid tiles', () => {
      expect(
        getSmallestScaleFactorAsSingleImage({
          id: 'http://example.org/service/1',
          profile: 'level1',
          height: 1024,
          width: 2048,
          tiles: [{ width: 0, scaleFactors: [1, 2, 3, 4, 8] }],
        })
      ).toEqual(null);
    });

    test('multiple tiles', () => {
      expect(
        getSmallestScaleFactorAsSingleImage({
          id: 'http://example.org/service/1',
          profile: 'level1',
          height: 1024,
          width: 2048,
          tiles: [{ width: 256, scaleFactors: [1, 2] }, { width: 512, scaleFactors: [4, 8] }],
        })
      ).toEqual({ height: 256, id: 'http://example.org/service/1', type: 'fixed-service', width: 512 });
    });
  });

  describe('isImageService', () => {
    test('not image service', () => {
      expect(
        isImageService({
          id: 'http://example.org/service/1',
          profile: '',
        })
      ).toEqual(false);
    });
  });

  describe('getImageCandidates', () => {
    test('static image resource', () => {
      expect(
        getImageCandidates(
          {
            id: 'http://example.org/image.jpg',
            type: 'Image',
            width: 100,
            height: 200,
          },
          false
        )
      ).toEqual([{ height: 200, id: 'http://example.org/image.jpg', type: 'fixed', width: 100 }]);
    });

    test('just a url', () => {
      expect(getImageCandidates('http://example.org/image.jpg', false)).toEqual([
        {
          id: 'http://example.org/image.jpg',
          type: 'unknown',
        },
      ]);
    });

    test('image with embedded service (level 0)', () => {
      expect(
        getImageCandidates(
          {
            id: 'http://example.org/image.jpg',
            width: 1200,
            height: 800,
            type: 'Image',
            service: [
              {
                id: 'http://example.org/image/service',
                profile: 'level0',
                protocol: 'ttp://iiif.io/api/image',
              },
            ],
          },
          false
        )
      ).toEqual([{ height: 800, id: 'http://example.org/image.jpg', type: 'fixed', width: 1200 }]);
    });

    test('image with embedded service (level 0 + sizes)', () => {
      expect(
        getImageCandidates(
          {
            id: 'http://example.org/image.jpg',
            width: 1200,
            height: 800,
            type: 'Image',
            service: [
              {
                id: 'http://example.org/image/service',
                profile: 'level0',
                protocol: 'ttp://iiif.io/api/image',
                sizes: [{ width: 600, height: 400 }, { width: 300, height: 200 }],
              },
            ],
          },
          false
        )
      ).toEqual([
        { height: 800, id: 'http://example.org/image.jpg', type: 'fixed', width: 1200 },
        { height: 400, id: 'http://example.org/image/service', type: 'fixed-service', width: 600 },
        { height: 200, id: 'http://example.org/image/service', type: 'fixed-service', width: 300 },
      ]);
    });

    test('image with embedded server (level0 + tiles)', () => {
      expect(
        getImageCandidates(
          {
            id: 'http://example.org/image.jpg',
            width: 1200,
            height: 800,
            type: 'Image',
            service: [
              {
                id: 'http://example.org/image/service',
                profile: ['level0', { supports: ['regionByPx', 'sizeByW'] }],
                protocol: 'ttp://iiif.io/api/image',
                tiles: [{ width: 256, scaleFactors: [1, 2, 4, 8, 16] }],
              },
            ],
          },
          false
        )
      ).toEqual([
        { height: 800, id: 'http://example.org/image.jpg', type: 'fixed', width: 1200 },
        {
          id: 'http://example.org/image/service',
          maxHeight: 256,
          maxWidth: 256,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('image with embedded server (level1 + tiles)', () => {
      expect(
        getImageCandidates(
          {
            id: 'http://example.org/image.jpg',
            width: 1200,
            height: 800,
            type: 'Image',
            service: [
              {
                id: 'http://example.org/image/service',
                profile: 'level1',
                protocol: 'ttp://iiif.io/api/image',
                tiles: [{ width: 256, scaleFactors: [1, 2, 4, 8, 16] }],
              },
            ],
          },
          false
        )
      ).toEqual([
        { height: 800, id: 'http://example.org/image.jpg', type: 'fixed', width: 1200 },
        {
          id: 'http://example.org/image/service',
          maxHeight: 256,
          maxWidth: 256,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });

    test('non image example', () => {
      expect(getImageCandidates({ id: 'http://example.org/audio.mp3', type: 'Sound' })).toEqual([]);
    });

    test('example thumbnail service', () => {
      expect(
        getImageCandidates(
          {
            id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393/full/72,100/0/default.jpg',
            type: 'Image',
            service: [
              {
                '@context': 'http://iiif.io/api/image/2/context.json',
                id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393',
                protocol: 'http://iiif.io/api/image',
                height: 1024,
                width: 732,
                sizes: [
                  {
                    width: 72,
                    height: 100,
                  },
                  {
                    width: 143,
                    height: 200,
                  },
                  {
                    width: 286,
                    height: 400,
                  },
                  {
                    width: 732,
                    height: 1024,
                  },
                ],
                profile: ['http://iiif.io/api/image/2/level0.json'],
              },
            ],
          },
          false
        )
      ).toEqual([
        {
          height: 100,
          id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393/full/72,100/0/default.jpg',
          type: 'fixed',
          width: 72,
        },
        {
          height: 100,
          id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393',
          type: 'fixed-service',
          width: 72,
        },
        {
          height: 200,
          id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393',
          type: 'fixed-service',
          width: 143,
        },
        {
          height: 400,
          id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393',
          type: 'fixed-service',
          width: 286,
        },
        {
          height: 1024,
          id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393',
          type: 'fixed-service',
          width: 732,
        },
      ]);
    });
  });

  describe('getImageCandidates - dereferenced', () => {
    const image1 = {
      '@context': 'http://iiif.io/api/image/2/context.json',
      id: 'https://damsssl.llgc.org.uk/iiif/2.0/image/4694557',
      protocol: 'http://iiif.io/api/image',
      width: 4961,
      height: 6716,
      tiles: [
        {
          width: 256,
          height: 256,
          scaleFactors: [1, 2, 4, 8, 16, 32],
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

    const image2 = {
      '@context': 'http://iiif.io/api/image/2/context.json',
      id: 'https://damsssl.llgc.org.uk/iiif/2.0/image/4694558',
      protocol: 'http://iiif.io/api/image',
      width: 4968,
      height: 6719,
      tiles: [
        {
          width: 256,
          height: 256,
          scaleFactors: [1, 2, 4, 8, 16, 32],
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

    // const image3 = {
    //   '@context': 'http://iiif.io/api/image/2/context.json',
    //   id: 'https://damsssl.llgc.org.uk/iiif/2.0/image/4694562',
    //   protocol: 'http://iiif.io/api/image',
    //   width: 6687,
    //   height: 4967,
    //   tiles: [
    //     {
    //       width: 256,
    //       height: 256,
    //       scaleFactors: [1, 2, 4, 8, 16, 32],
    //     },
    //   ],
    //   profile: [
    //     'http://iiif.io/api/image/2/level1.json',
    //     {
    //       formats: ['jpg'],
    //       qualities: ['native', 'color', 'gray'],
    //       supports: [
    //         'regionByPct',
    //         'sizeByForcedWh',
    //         'sizeByWh',
    //         'sizeAboveFull',
    //         'rotationBy90s',
    //         'mirroring',
    //         'gray',
    //       ],
    //     },
    //   ],
    // };

    test('simple nlw example', async () => {
      const loader = new ImageServiceLoader();
      loader.setConfig({ enableFetching: false });

      await loader.sample(image1);
      await loader.sample(image2);

      expect(
        getImageCandidates(
          {
            id: image1.id,
            type: 'Image',
            width: image1.width,
            height: image1.height,
            service: [
              {
                id: image1.id,
                profile: image1.profile,
                protocol: image1.protocol,
              },
            ],
          },
          true,
          loader
        )
      ).toEqual([
        { height: 6716, id: 'https://damsssl.llgc.org.uk/iiif/2.0/image/4694557', type: 'fixed', width: 4961 },
        {
          id: 'https://damsssl.llgc.org.uk/iiif/2.0/image/4694557',
          maxHeight: 256,
          maxWidth: 256,
          minHeight: 0,
          minWidth: 0,
          type: 'variable',
        },
      ]);
    });
  });

  describe('pickBestFromCandidates', () => {
    test('image url only option', () => {
      expect(
        pickBestFromCandidates(
          {
            width: 100,
            height: 100,
          },
          [() => [{ id: 'http://example.org/image.jpg', type: 'unknown' }]]
        )
      ).toEqual({ best: { id: 'http://example.org/image.jpg', type: 'unknown' }, fallback: [] });
    });

    test('exact match', () => {
      expect(
        pickBestFromCandidates(
          {
            width: 100,
            height: 100,
          },
          [
            () => [
              { id: 'http://example.org/image.jpg', type: 'unknown' },
              { id: 'http://example.org/image-1.jpg', type: 'fixed', width: 100, height: 100 },
            ],
          ]
        )
      ).toEqual({
        best: { id: 'http://example.org/image-1.jpg', type: 'fixed', width: 100, height: 100 },
        fallback: [],
      });
    });

    test('candidates are chosen in order', () => {
      expect(() =>
        pickBestFromCandidates({ width: 100, height: 100 }, [
          // Because typescript.
          () => {
            if (true as false) {
              throw new Error();
            }
            return [{ id: '', type: 'unknown' }] as ImageCandidate[];
          },
          () => [{ id: 'http://example.org/image-1.jpg', type: 'fixed', width: 100, height: 100 }],
        ])
      ).toThrow();
    });

    test('good candidate, then better candidate, all options for a fallback', () => {
      expect(
        pickBestFromCandidates(
          {
            width: 100,
            height: 100,
            returnAllOptions: true,
          },
          [
            () => [
              { id: 'http://example.org/image-1.jpg', type: 'fixed', width: 50, height: 50 },
              { id: 'http://example.org/image.jpg', type: 'unknown' },
              { id: 'http://example.org/image-2.jpg', type: 'fixed', width: 100, height: 100 },
            ],
          ]
        )
      ).toEqual({
        best: { height: 100, id: 'http://example.org/image-2.jpg', type: 'fixed', width: 100 },
        fallback: [
          { height: 50, id: 'http://example.org/image-1.jpg', type: 'fixed', width: 50 },
          { id: 'http://example.org/image.jpg', type: 'unknown' },
        ],
      });
    });

    test('safe image service option', () => {
      expect(
        pickBestFromCandidates(
          {
            width: 100,
            height: 100,
            unsafeImageService: false,
          },
          [
            () => [
              { id: 'http://example.org/image.jpg', type: 'unknown' },
              { id: 'http://service/info.json', type: 'fixed-service', width: 256, height: 256 },
            ],
          ]
        )
      ).toEqual({
        best: {
          height: 256,
          id: 'http://service/full/256,256/0/default.jpg',
          type: 'fixed',
          unsafe: false,
          width: 256,
        },
        fallback: [],
      });
    });

    test('preferFixedSize', () => {
      expect(
        pickBestFromCandidates(
          {
            width: 100,
            height: 100,
            preferFixedSize: true,
            returnAllOptions: true,
          },
          [
            () => [
              { id: 'http://example.org/image.jpg', type: 'unknown' },
              { id: 'http://service/info.json', type: 'fixed-service', width: 256, height: 256 },
            ],
            () => [{ id: 'http://example.org/image-2.jpg', type: 'fixed', width: 110, height: 110 }],
          ]
        )
      ).toEqual({
        best: { height: 110, id: 'http://example.org/image-2.jpg', type: 'fixed', width: 110 },
        fallback: [
          { height: 100, id: 'http://service/full/100,100/0/default.jpg', type: 'fixed', unsafe: true, width: 100 },
          { id: 'http://example.org/image.jpg', type: 'unknown' },
        ],
      });
    });

    test('when match found, second list is not touched', () => {
      expect(() =>
        pickBestFromCandidates({ width: 100, height: 100 }, [
          () => [{ id: 'http://example.org/image-1.jpg', type: 'fixed', width: 100, height: 100 }],
          // Because typescript.
          () => {
            if (true as false) {
              throw new Error();
            }
            return [{ id: '', type: 'unknown' }] as ImageCandidate[];
          },
        ])
      ).not.toThrow();
    });
  });

  describe('inferSizeFromUrl', () => {
    test('simple image', () => {
      expect(
        inferSizeFromUrl(
          'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393/full/72,100/0/default.jpg'
        )
      ).toEqual({
        height: 100,
        id: 'https://dlcs.io/thumbs/wellcome/1/f327de6b-06ef-47ec-b98f-ee79c1685393/full/72,100/0/default.jpg',
        type: 'fixed',
        width: 72,
      });
    });
  });
});
