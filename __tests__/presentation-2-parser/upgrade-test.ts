import iiifManifest from '../../fixtures/presentation-2/iiif-fixture-manifest.json';
import iiifManifest2 from '../../fixtures/presentation-2/biblissima-manifest.json';
import blManifest from '../../fixtures/presentation-2/bl-manifest.json';
import nlwManifest from '../../fixtures/presentation-2/nlw-manifest.json';
import bodleianManifest from '../../fixtures/presentation-2/bodleian-manifest.json';
import stanfordManifest from '../../fixtures/presentation-2/stanford-manifest.json';
import folgerManifest from '../../fixtures/presentation-2/folger-manifest.json';
import villanovaManifest from '../../fixtures/presentation-2/villanova-manifest.json';
import ngaManifest from '../../fixtures/presentation-2/nga-manifest.json';
import quatarManifest from '../../fixtures/presentation-2/quatar-manifest.json';
import { presentation2to3 } from '../../packages/presentation-2-parser/src/upgrader';
import { Validator } from '../../packages/validator/src/validator';

describe('Presentation 2 to 3', () => {
  const validator = new Validator();

  test('Simple manifest', () => {
    const result = presentation2to3.traverseManifest(iiifManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });
  test('Biblissima manifest', () => {
    const result = presentation2to3.traverseManifest(iiifManifest2 as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });

  test('British Library manifest', () => {
    const result = presentation2to3.traverseManifest(blManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });

  test('NLW manifest', () => {
    const result = presentation2to3.traverseManifest(nlwManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });

  test('Bodleian manifest', () => {
    const result = presentation2to3.traverseManifest(bodleianManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });

  test('Stanford manifest', () => {
    const result = presentation2to3.traverseManifest(stanfordManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });

  test('Folger manifest', () => {
    const result = presentation2to3.traverseManifest(folgerManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });

  test('Villanova manifest', () => {
    const result = presentation2to3.traverseManifest(villanovaManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });

  test('NGA manifest', () => {
    const result = presentation2to3.traverseManifest(ngaManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });
  test('Quatar manifest', () => {
    const result = presentation2to3.traverseManifest(quatarManifest as any);
    const isValid = validator.validateManifest(result);

    expect(validator.validators.manifest.errors).toEqual(null);
    expect(isValid).toEqual(true);
  });
});
