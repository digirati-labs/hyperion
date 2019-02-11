import { AnnotationPageNormalized } from '@hyperion-framework/types';
import { createContext } from '../context/createContext';

export const emptyAnnotationPage: AnnotationPageNormalized = {
  id: 'https://hyperion/annotation-page',
  type: 'AnnotationPage',
  behaviour: [],
  motivation: null,
  label: null,
  thumbnail: [],
  summary: null,
  requiredStatement: null,
  metadata: [],
  rights: null,
  items: [],
  seeAlso: [],
  homepage: null,
  logo: [],
  rendering: [],
  service: [],
};

export const annotationPageContext = createContext({
  name: 'annotationPage',
  creator: (id: string) => ({ id, type: 'AnnotationPage' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.AnnotationPage[ref.id];
  },
});
