import { EnvironmentConfig } from '../app/core/models/environment-config.model';
import { defaultEnvironment } from './environment.default';

export const environment: EnvironmentConfig = {
  ...defaultEnvironment,
  production: false,
  stage: 'dev',
  auth: {
    config: {
      ...defaultEnvironment.auth.config,
      authority: process.env['COGNITO_AUTHORITY'],
      redirectUrl: process.env['COGNITO_REDIRECT_URL'],
      clientId: process.env['COGNITO_CLIENT_ID'],
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
