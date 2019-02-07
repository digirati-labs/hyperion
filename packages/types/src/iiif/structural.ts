import { Reference } from '../reference';
import { AnnotationPage } from '../resources/annotationPage';
import { Range } from '../resources/range';

export type StructuralProperties<T> = {
  items: T[];
  // @todo annotations
  annotations: AnnotationPage[];
  // @todo structures
  structures: Range[];
};

export type StructuralNormalized<T extends Reference<P> | Reference<P>, P> = {
  items: T[];
  annotations: Array<Reference<'Annotation'>>;
  structures: Array<Reference<'Range'>>;
};
