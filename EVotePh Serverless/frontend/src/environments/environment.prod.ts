import { EnvironmentConfig } from '../app/core/models/environment-config.model';
import { defaultEnvironment } from './environment.default';

export const environment: EnvironmentConfig = {
  ...defaultEnvironment,
  production: true,
  stage: 'prod',
  auth: {
    config: {
      authority: `https://cognito-idp.ap-southeast-1.amazonaws.com/${
        import.meta.env.NG_APP_PROD_COGNITO_USER_POOL_ID
      }`,
      redirectUrl: '',
      clientId: import.meta.env.NG_APP_PROD_COGNITO_CLIENT_ID,
      scope: 'email openid profile',
      responseType: 'code',
      secureRoutes: [import.meta.env.NG_APP_PROD_API_URL],
    },
  },
  api: {
    ...defaultEnvironment.api,
    url: `${import.meta.env.NG_APP_API_URL}/prod`,
  },
};
