import { IdOrAtId } from '../utility';

export declare type AuthAccessTokenService = IdOrAtId<string> & {
  profile: 'http://iiif.io/api/auth/1/token' | 'AuthTokenService1';
};

export declare type AuthAccessTokenServiceResponse = {
  accessToken: string;
  expiresIn?: number;
};

export declare type AuthAccessTokenServiceError = {
  error: 'invalidRequest' | 'missingCredentials' | 'invalidCredentials' | 'invalidOrigin' | 'unavailable';
  description?: string;
};

type AuthAbstractService = IdOrAtId<string> & {
  label: string;
  confirmLabel?: string;
  header?: string;
  description?: string;
  failureHeader?: string;
  failureDescription?: string;
};

export declare type AuthClickThroughService = IdOrAtId<string> & {
  profile: 'http://iiif.io/api/auth/1/clickthrough';
  service: AuthAccessTokenService;
};

export declare type AuthLogoutService = AuthAbstractService & {
  profile: 'http://iiif.io/api/auth/1/logout' | 'AuthLogoutService1';
};

export declare type AuthLoginService = AuthAbstractService & {
  profile: 'http://iiif.io/api/auth/1/login' | 'AuthCookieService1';
  service: Array<AuthLoginService | AuthLogoutService>;
};

export declare type AuthKioskService = AuthAbstractService & {
  profile: 'http://iiif.io/api/auth/1/kiosk';
  service: AuthAccessTokenService;
};

export declare type AuthExternalService = AuthAbstractService & {
  profile: 'http://iiif.io/api/auth/1/external';
  service: AuthAccessTokenService;
};

export declare type AuthService = AuthLoginService | AuthClickThroughService | AuthKioskService | AuthExternalService;
