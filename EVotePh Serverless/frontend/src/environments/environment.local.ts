import { EnvironmentConfig } from '../app/core/models/environment-config.model';
import { defaultEnvironment } from './environment.default';

export const environment: EnvironmentConfig = {
  ...defaultEnvironment,
  production: false,
  stage: 'local',
  auth: {
    config: {
      ...defaultEnvironment.auth.config,
      secureRoutes: ['http://localhost:5000'],
    },
  },
  api: {
    ...defaultEnvironment.api,
    url: 'http://localhost:5000/dev',
  },
};
