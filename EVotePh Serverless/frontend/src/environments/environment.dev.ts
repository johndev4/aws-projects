import { EnvironmentConfig } from '../app/core/models/environment-config.model';
import { defaultEnvironment } from './environment.default';

export const environment: EnvironmentConfig = {
  ...defaultEnvironment,
  production: false,
  stage: 'dev',
  auth: {
    config: {
      ...defaultEnvironment.auth.config,
      // redirectUrl: '', // Change to frontend dev url
    },
  },
  api: {
    ...defaultEnvironment.api,
  },
};
