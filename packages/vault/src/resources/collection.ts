import { CollectionNormalized } from '@hyperion-framework/types';
import { createContext } from '../context/createContext';

export const emptyCollection: CollectionNormalized = {
  id: 'https://hyperion/empty-collection',
  type: 'Collection',
  label: null,
  viewingDirection: 'left-to-right',
  behaviour: [],
  motivation: null,
  thumbnail: [],
  posterCanvas: null,
  summary: null,
  requiredStatement: null,
  metadata: [],
  rights: null,
  navDate: null,
  items: [],
  annotations: [],
  seeAlso: [],
  homepage: null,
  logo: [],
  partOf: [],
  rendering: [],
  service: [],
};

export const collectionContext = createContext({
  name: 'collection',
  creator: (id: string) => ({ id, type: 'Collection' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.Collection[ref.id];
  },
});
