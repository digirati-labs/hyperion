import { Reference, SingleReference } from '../reference';
import { AnnotationPage } from '../resources/annotationPage';
import { Range } from '../resources/range';

export type StructuralProperties<T> = {
  items: T[];
  // @todo annotations
  annotations: AnnotationPage[];
  // @todo structures
  structures: Range[];
};

export type StructuralNormalized<T extends SingleReference<P> | Reference<P>, P> = {
  items: T[];
  annotations: Array<SingleReference<'annotation'>>;
  structures: Array<SingleReference<'range'>>;
};
