export declare type Reference<T = string> = {
  type: T;
  id: string;
};

export type PolyEntity = Reference | string;
