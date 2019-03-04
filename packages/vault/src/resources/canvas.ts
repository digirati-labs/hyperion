import { CanvasNormalized } from '@hyperion-framework/types';
import { createContext } from '../context/createContext';

export const emptyCanvas: CanvasNormalized = {
  id: 'https://hyperion/empty-canvas',
  type: 'Canvas',
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
  duration: 0,
  height: 0,
  width: 0,
};

export const canvasContext = createContext({
  name: 'canvas',
  creator: (id: string) => ({ id, type: 'Canvas' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.Canvas[ref.id];
  },
});
