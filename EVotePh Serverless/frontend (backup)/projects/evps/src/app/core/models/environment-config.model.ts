import { OpenIdConfiguration } from 'angular-auth-oidc-client';
import { ApiConfig } from './api-config.model';

export type StageType = 'local' | 'dev' | 'prod';
export interface EnvironmentConfig {
  production: boolean;
  stage: StageType;
  api: ApiConfig;
  auth: {
    config: OpenIdConfiguration | OpenIdConfiguration[];
  };
}
