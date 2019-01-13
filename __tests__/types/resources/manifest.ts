import { Manifest } from '../../../src';

import ghentManifest from '../../../fixtures/2-to-3-converter/manifests/ghent-university-manifest.json';
import blManifest from '../../../fixtures/2-to-3-converter/manifests/british-library-manifest.json';
import princetonManifest from '../../../fixtures/2-to-3-converter/manifests/princeton-manifest.json';
import ncsuManifest from '../../../fixtures/2-to-3-converter/manifests/ncsu-libraries-manifest.json';
import nlwNewspaper from '../../../fixtures/2-to-3-converter/manifests/nlw-newspaper-manifest.json';
import nlwManuscript from '../../../fixtures/2-to-3-converter/manifests/nlw-manuscript-manifest.json';
import { matchAnnotationBody } from '../../../src/types/resources/annotation';
import { ContentResource } from '../../../src/types/resources/contentResource';

describe('types/manifest', () => {
  describe('Manifests converted from Presentation 2', () => {
    test('British Library', () => {
      const manifest: Manifest = blManifest as Manifest;

      expect(manifest).toBeDefined();

      expect(manifest.items[0].seeAlso).toEqual([
        {
          format: 'application/xml',
          id: 'https://api.bl.uk/text/alto/ark:/81055/vdc_00000004216B.0x000001',
          label: { '@none': ['ALTO XML'] },
          profile: 'https://www.loc.gov/standards/alto/',
          type: 'Dataset',
        },
        {
          format: 'text/plain',
          id: 'https://api.bl.uk/text/plain/ark:/81055/vdc_00000004216B.0x000001',
          label: { '@none': ['Plain text OCR'] },
          type: 'Dataset',
        },
      ]);

      const mapper = matchAnnotationBody<ContentResource>({
        ContentResource: (p1: ContentResource) => p1,
      });

      const body = manifest.items[0].items![0].items![0].body;

      expect(body).toBeDefined();

      if (typeof body === 'undefined') {
        throw new Error('Body is not defined');
      }

      expect(mapper(body)).toEqual([
        {
          format: 'image/jpg',
          id: 'https://api.bl.uk/image/iiif/ark:/81055/vdc_00000004216A.0x000001/full/max/0/default.jpg',
          service: [
            {
              height: 2920,
              id: 'https://api.bl.uk/image/iiif/ark:/81055/vdc_00000004216A.0x000001',
              profile: [
                'http://iiif.io/api/image/2/level2.json',
                {
                  qualities: ['gray', 'color', 'bitonal'],
                  supports: ['profileLinkHeader', 'rotationArbitrary', 'regionSquare', 'mirroring'],
                },
              ],
              protocol: 'http://iiif.io/api/image',
              tiles: [{ scaleFactors: [1, 2, 4, 8, 16], width: 256 }],
              type: 'ImageService2',
              width: 2181,
            },
          ],
          type: 'Image',
        },
      ]);
    });

    test('Ghent University Library', async () => {
      const manifest: Manifest = ghentManifest as Manifest;

      expect(manifest).toBeDefined();

      expect(manifest.label).toEqual({
        '@none': ['Document uit het archief van de dichter Dioskoros van Aphrodite (?)[manuscript]'],
      });
    });

    test('NCSU Libraries manifest', () => {
      const manifest = ncsuManifest as Manifest;

      expect(manifest).toBeDefined();

      const idPrefix = 'https://ocr.lib.ncsu.edu/ocr/nu/nubian-message-1992-11-30_0001/';

      expect(manifest.items[0].annotations).toEqual([
        {
          id: idPrefix + 'nubian-message-1992-11-30_0001-annotation-list-word.json',
          label: { '@none': ['Text of this page (word level)'] },
          type: 'AnnotationPage',
        },
        {
          id: idPrefix + 'nubian-message-1992-11-30_0001-annotation-list-line.json',
          label: { '@none': ['Text of this page (line level)'] },
          type: 'AnnotationPage',
        },
        {
          id: idPrefix + 'nubian-message-1992-11-30_0001-annotation-list-paragraph.json',
          label: { '@none': ['Text of this page (paragraph level)'] },
          type: 'AnnotationPage',
        },
      ]);
    });

    test('NLW Manuscript manifest', () => {
      const manifest: Manifest = nlwManuscript as Manifest;

      expect(manifest).toBeDefined();

      expect(manifest.logo).toEqual([
        {
          id: 'https://damsssl.llgc.org.uk/iiif/2.0/image/logo/full/400,/0/default.jpg',
          service: [
            {
              '@context': ' http://iiif.io/api/image/2/context.json',
              id: ' https://damsssl.llgc.org.uk/iiif/2.0/image/logo',
              profile: ' http://iiif.io/api/image/2/level1.json',
              type: 'Service',
            },
          ],
          type: 'Image',
        },
      ]);
    });

    test('NLW Newspaper manifest', () => {
      const manifest: Manifest = nlwNewspaper as Manifest;

      expect(manifest).toBeDefined();

      const annotationPage = manifest.items[0].annotations;

      expect(annotationPage).toBeDefined();

      expect(annotationPage![0].partOf).toEqual([
        {
          id: 'http://dams.llgc.org.uk/iiif/3320640/annotation/layer/modsarticle1.json',
          label: { '@none': ['OCR Article Text'] },
          type: 'AnnotationCollection',
        },
      ]);
    });

    test('Princeton manifest', () => {
      const manifest: Manifest = princetonManifest as Manifest;

      expect(manifest).toBeDefined();

      expect(manifest.requiredStatement).toEqual({
        label: { '@none': ['Attribution'] },
        value: { '@none': ['Provided by the Blue Mountain Project at Princeton University'] },
      });
    });
  });
});
