import { EmbeddedResource, ExternalResourceTypes, ExternalWebResource, SpecificResource } from './annotation';
import { Service } from './service';

export declare type IIIFExternalWebResource = ExternalWebResource & {
  type: ExternalResourceTypes | string;
  height?: number;
  width?: number;
  service?: Service[];
  duration?: number;
};

export declare type ContentResource =
  | string
  | EmbeddedResource
  | ExternalWebResource
  | SpecificResource
  | IIIFExternalWebResource;
