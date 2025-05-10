import { OpenIdConfiguration } from 'angular-auth-oidc-client';
import { ApiConfig } from './api-config.model';

export interface EnvironmentConfig {
  production: boolean;
  stage: string;
  api: ApiConfig;
  auth: {
    config: OpenIdConfiguration | OpenIdConfiguration[];
  };
}
