export type Required<T> =
    T extends object
        ? { [P in keyof T]-?: NonNullable<T[P]>; }
        : T;

export type SomeRequired<T, K extends keyof T> =
    (T extends object
        ? { [P in K]-?: NonNullable<T[P]>; }
        : T) & Partial<Pick<Required<T>, Exclude<keyof T, K>>>;

export type OmitProperties<T, K extends keyof T> = Pick<
    Required<T>, Exclude<keyof T, K>
    >;
