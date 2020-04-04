import {Vault} from '../../src';
import {serialise, UNSET, UNWRAP} from '../../src/processing/serialise';

const manifestTest = require('../../../../fixtures/2-to-3-converter/manifests/british-library-manifest.json');

describe('process/serialise', () => {

  test('it works', async () => {

    const vault = new Vault();

    const manifest = await vault.loadManifest(manifestTest.id, manifestTest);

    const result = serialise(vault, manifest, {
      Manifest: function* (manifest) {
        return [
          ['@id', manifest.id],
          ['test', {testing: true}],
          ['sequences', [
              {
                id: `${manifest.id}/sequence0`,
                canvases: yield manifest.items
              }
            ]
          ],
        ];
      },
      Canvas: function* (canvas) {
        if (!canvas.label) {
          return UNSET;
        }
        return [
          [UNWRAP, canvas.label]
        ];
      }
    });

    expect(result).toMatchSnapshot();


  })


});
