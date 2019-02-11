import { AnnotationNormalized } from '@hyperion-framework/types';
import { createContext } from '../context/createContext';

// This won't be used, it's overkill. But it shows you what a completely empty AND NORMALIZED annotation looks like.
// This is where we will lean on pattern matching to ensure we are safely accessing annotation fields.
export const emptyAnnotation: AnnotationNormalized = {
  id: 'https://hyperion/annotation-page',
  type: 'AnnotationPage',
  behaviour: [],
  label: null,
  thumbnail: [],
  summary: null,
  requiredStatement: null,
  metadata: [],
  seeAlso: [],
  homepage: null,
  logo: [],
  rendering: [],
  service: [],
  accessibility: [],
  audience: [],
  body: [],
  bodyValue: null,
  canonical: null,
  created: null,
  creator: [],
  generated: null,
  generator: [],
  modified: null,
  motivation: [],
  rights: [],
  stylesheet: null,
  target: [],
  timeMode: undefined, // @todo bug? should be null.
  via: [],
  partOf: [],
};

export const annotationContext = createContext({
  name: 'annotation',
  creator: (id: string) => ({ id, type: 'Annotation' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.Annotation[ref.id];
  },
});
