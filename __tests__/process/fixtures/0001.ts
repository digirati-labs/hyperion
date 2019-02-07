import { Manifest } from '../../../packages/legacy/src';
import json from './0001.json';

describe('process/fixtures/0001', () => {
  test('fixture is correctly typed', () => {
    const manifest: Manifest = json as Manifest;

    expect(manifest).toBeDefined();
  });
});
