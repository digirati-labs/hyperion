export declare type Required<T> = T extends object ? { [P in keyof T]-?: NonNullable<T[P]> } : T;

export declare type SomeRequired<T, K extends keyof T> = (T extends object ? { [P in K]-?: NonNullable<T[P]> } : T) &
  Partial<Pick<Required<T>, Exclude<keyof T, K>>>;

export declare type OmitProperties<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export declare type JsonLDContext = {
  '@context'?: string | string[];
}
