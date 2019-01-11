import {Reference, SingleReference} from '../reference';

export type StructuralProperties<T> = {
    items: T[];
    // @todo annotations
    annotations: [any];
    // @todo structures
    structures: [any];
};

export type StructuralNormalized<T extends SingleReference<P> | Reference<P>, P> = {
  items: T[];
  annotations: Array<SingleReference<'annotation'>>;
  structures: Array<SingleReference<'range'>>;
};
