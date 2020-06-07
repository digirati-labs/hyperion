export declare type GeoJsonService = {
  '@context': 'http://geojson.org/geojson-ld/geojson-context.jsonld';
  profile: never;
} & (
  | {
      '@id': string;
    }
  | {
      id: string;
    }) &
  Partial<import('@types/geojson').GeoJSON>;
