import { serialise } from '../../packages/parser/src/serialise';
import nlsManifest2 from '../../fixtures/presentation-2/sbb-test.json';
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
