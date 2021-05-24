import { serialise } from '../../packages/parser/src/serialise';
import nlsManifest2 from '../../fixtures/presentation-2/sbb-test.json';
import wellcome3 from '../../fixtures/manifests/wellcome-p3.json';
import wellcome3example2 from '../../fixtures/manifests/wellcome-p3-2.json';
import { Vault } from '../../packages/vault/src/Vault';
import { serialiseConfigPresentation2 } from '../../packages/parser/src/serialise-presentation-2';
import { serialiseConfigPresentation3 } from '../../packages/parser/src/serialise-presentation-3';
import { Validator } from '../../packages/validator/src/validator';

describe('Compatibility', () => {
  test('Presentation 2 serialisation from normalised 3', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(nlsManifest2['@id'], nlsManifest2);

    const result = serialise(vault.getState(), manifest, serialiseConfigPresentation2);

    expect(result as any).toMatchSnapshot();

    // No validator exists at the moment.
  });

  // This calls out the the network, skip in normal test runs.
  test.skip('Wellcome - presentation 3', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(wellcome3example2.id, wellcome3example2);

    global.fetch = require('node-fetch');
    const thumbnail0 = await vault.getThumbnail({ type: 'Canvas', id: manifest.items[0].id }, {});
    const thumbnail1 = await vault.getThumbnail({ type: 'Canvas', id: manifest.items[1].id }, {});
    const thumbnail2 = await vault.getThumbnail(
      { type: 'Canvas', id: manifest.items[2].id },
      { returnAllOptions: true }
    );

    expect(thumbnail2.best).toMatchInlineSnapshot(`
      Object {
        "height": 100,
        "id": "https://iiif.wellcomecollection.org/thumbs/b18035723_0004.JP2/full/71,100/0/default.jpg",
        "type": "fixed",
        "unsafe": false,
        "width": 71,
      }
    `);
  });

  test('Wellcome - Presentation 2 serialisation from normalised 3', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(wellcome3.id, wellcome3);

    const result = serialise(vault.getState(), manifest, serialiseConfigPresentation2) as any;

    expect(result.rendering[0]).toEqual({
      '@id': 'https://dlcs.io/pdf/wellcome/pdf/6/b28857021',
      format: 'application/pdf',
      label: 'View as PDF',
    });

    expect(result.rendering[1]).toEqual({
      '@id': 'https://iiif-test.wellcomecollection.org/text/v1/b28857021',
      format: 'text/plain',
      label: 'View raw text',
    });

    expect(result.thumbnail.service).toMatchInlineSnapshot(`
      Object {
        "@id": "https://dlcs.io/thumbs/wellcome/6/b28857021_0001.jp2",
        "height": 1024,
        "profile": "http://iiif.io/api/image/2/level0.json",
        "sizes": Array [
          Object {
            "height": 100,
            "width": 61,
          },
          Object {
            "height": 200,
            "width": 121,
          },
          Object {
            "height": 400,
            "width": 242,
          },
          Object {
            "height": 1024,
            "width": 620,
          },
        ],
        "width": 620,
      }
    `);

    // No validator exists at the moment.
  });

  test('Presentation 3 serialisation from normalised', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(nlsManifest2['@id'], nlsManifest2);

    const result = serialise(vault.getState(), manifest, serialiseConfigPresentation3);

    const validator = new Validator();

    const isValid = await validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);

    expect(isValid).toEqual(true);

    expect(result as any).toMatchSnapshot();
  });
});
