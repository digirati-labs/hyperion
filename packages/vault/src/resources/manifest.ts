import { ManifestNormalized } from '@hyperion-framework/types';
import { createContext } from '../context/createContext';

export const emptyManifest: ManifestNormalized = {
  id: 'https://hyperion/empty-manifest',
  type: 'Manifest',
  annotations: [],
  behavior: [],
  homepage: null,
  items: [],
  label: null,
  logo: [],
  metadata: [],
  motivation: null,
  navDate: null,
  partOf: [],
  posterCanvas: null,
  rendering: [],
  requiredStatement: null,
  rights: null,
  seeAlso: [],
  service: [],
  start: null,
  structures: [],
  summary: null,
  thumbnail: [],
  viewingDirection: 'left-to-right',
};

export const manifestContext = createContext({
  name: 'manifest',
  creator: (id: string) => ({ id, type: 'Manifest' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.Manifest[ref.id];
  },
});
