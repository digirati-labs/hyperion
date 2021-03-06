import { createRollupConfig } from '../../create-rollup-config';
import pkg from './package.json';

export default createRollupConfig('HyperionReactVault', pkg, [
  'react',
  'react-dom',
  'redux',
  'react-query',
  '@atlas-viewer/iiif-image-api',
  '@hyperion-framework/vault',
  '@hyperion-framework/store',
  '@hyperion-framework/parser',
]);
