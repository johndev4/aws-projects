import { EnvStage, EnvAWSRegion } from '../app/core/enums/env-consts';
import { EnvironmentConfig } from '../app/core/models/environment-config.model';

import { wildrydesApiEndpoints } from './environment.endpoints';

export const environment: EnvironmentConfig = {
  stage: EnvStage.PRODUCTION,
  aws: {
    region: EnvAWSRegion.SINGAPORE,
    cognito: {
      userPoolId: import.meta.env.NG_APP_PROD_COGNITO_POOL_ID,
      userPoolClientId: import.meta.env.NG_APP_PROD_COGNITO_CLIENT_ID,
    },
    apiGateway: {
      url: import.meta.env.NG_APP_PROD_API_URL,
      endpoints: { ...wildrydesApiEndpoints },
    },
  },
};
