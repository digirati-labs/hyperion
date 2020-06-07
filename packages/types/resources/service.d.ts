import { AuthService } from '../services/auth-service';
import { GeoJsonService } from '../services/geo-json';
import { ImageService } from '../services/image-service';
import { SearchService } from '../services/search';

export type Service = AuthService | GeoJsonService | ImageService | SearchService;

export declare type ServiceNormalized = Service; // no more normalization.
