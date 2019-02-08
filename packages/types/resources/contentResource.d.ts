import { EmbeddedResource, ExternalResourceTypes, ExternalWebResource, SpecificResource } from './annotation';
import { Service } from './service';

export declare type ContentResource =
  | string
  | EmbeddedResource
  | ExternalWebResource
  | SpecificResource
  | ExternalWebResource & {
      type: ExternalResourceTypes | string;
      height?: number;
      width?: number;
      service?: [Service];
      duration?: number;
    };
