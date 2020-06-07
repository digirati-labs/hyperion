import { Reference } from '../reference';
import { AnnotationPage } from '../resources/annotationPage';
import { Range } from '../resources/range';

export declare type StructuralProperties<T> = {
  items: T[];
  annotations: AnnotationPage[];
  structures: Range[];
};

export declare type StructuralNormalized<T extends Reference<P>, P> = {
  items: T[];
  annotations: Array<Reference<'Annotation'>>;
  structures: Array<Reference<'Range'>>;
};
