import { EnvironmentConfig } from '../app/core/models/environment-config.model';

export const defaultEnvironment: EnvironmentConfig = {
  production: false,
  stage: 'dev',
  auth: {
    config: {
      authority: `https://cognito-idp.ap-southeast-1.amazonaws.com/${
        import.meta.env.NG_APP_COGNITO_USER_POOL_ID
      }`,
      redirectUrl: 'http://localhost:3000/auth',
      clientId: import.meta.env.NG_APP_COGNITO_CLIENT_ID,
      scope: 'email openid profile',
      responseType: 'code',
      secureRoutes: [import.meta.env.NG_APP_API_URL],
    },
  },
  api: {
    url: `${import.meta.env.NG_APP_API_URL}/dev`,
    endpoints: {
      voting: {
        castVote: '/voting/vote/cast',
        getEncryptionKey: '/voting/encryption/public-key',
        checkIfUserHasVoted: '/voting/user/has-voted',
      },
    },
  },
};
