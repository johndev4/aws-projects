import { EnvironmentConfig } from '../app/core/models/environment-config.model';

export const defaultEnvironment: EnvironmentConfig = {
  production: false,
  stage: 'dev',
  auth: {
    config: {
      authority:
        'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_GmF9PX1pB',
      redirectUrl: 'http://localhost:3000/auth',
      clientId: 'vmrh18s81kirej5m08jba4jq0',
      scope: 'email openid profile',
      responseType: 'code',
      secureRoutes: [
        'https://a70dt6pk6b.execute-api.ap-southeast-1.amazonaws.com',
      ],
    },
  },
  api: {
    url: 'https://a70dt6pk6b.execute-api.ap-southeast-1.amazonaws.com/dev',
    endpoints: {
      ballot: {
        castVote: '/ballot/vote',
        getEncryptionKey: '/ballot/encryption/public-key',
      },
    },
  },
};
