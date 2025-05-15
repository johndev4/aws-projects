import { EnvironmentConfig } from '../app/core/models/environment-config.model';
import { defaultEnvironment } from './environment.default';

export const environment: EnvironmentConfig = {
  ...defaultEnvironment,
  production: true,
  stage: 'prod',
  auth: {
    config: {
      ...defaultEnvironment.auth.config,
      authority: '',
      redirectUrl: '',
      clientId: '',
      scope: 'email openid profile',
      responseType: 'code',
      secureRoutes: [],
    },
  },
  api: {
    ...defaultEnvironment.api,
    url: '',
  },
};
