const json = require('./0001.json');
import { Manifest } from '@hyperion-framework/types';

describe('process/fixtures/0001', () => {
  test('fixture is correctly typed', () => {
    const manifest: Manifest = json as Manifest;

    expect(manifest).toBeDefined();
  });
});
