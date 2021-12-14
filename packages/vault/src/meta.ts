export interface Meta {
  // Default meta properties.
  eventManager: Record<
    string,
    | Array<{
        callback: (event: any, object: any) => void;
        scope?: string[];
      }>
    | undefined
  >;

  annotationPageManager: {
    views: {
      [id: string]: boolean;
    };
  };
}
