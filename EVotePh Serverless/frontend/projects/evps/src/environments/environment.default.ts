import { EnvironmentConfig } from '../app/core/models/environment-config.model';

export const defaultEnvironment: EnvironmentConfig = {
  production: false,
  stage: '',
  auth: {
    config: {
      scope: 'email openid profile',
      responseType: 'code',
      secureRoutes: [],
    },
  },
  api: {
    url: '',
    endpoints: {
      ballot: {
        castVote: '/ballot/cast',
        getEncryptionKey: '/ballot/encryption/public-key'
      },
    },
  },
};
