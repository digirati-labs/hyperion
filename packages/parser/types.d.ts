declare module 'iiif-prezi2to3' {
  import { Collection, Manifest } from '@hyperion-framework/types';
  export default class Upgrader {
    constructor(config: any);
    processManifest(resource: any): Manifest;
    processCollection(resource: any): Collection;
    processResource(resource: any, top: boolean): any;
  }
}
