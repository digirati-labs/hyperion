import { RangeNormalized } from '@hyperion-framework/types';
import { createContext } from '../context/createContext';

export const emptyRange: RangeNormalized = {
  id: 'https://hyperion/empty-canvas',
  type: 'Range',
  label: null,
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
  start: null,
  supplementary: null,
  viewingDirection: 'left-to-right',
};

export const rangeContext = createContext({
  name: 'range',
  creator: (id: string) => ({ id, type: 'Range' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.Range[ref.id];
  },
});
