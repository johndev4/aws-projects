import { EnvAWSRegion, EnvStage } from '../enums/env-consts';
import { WildrydesApiEndpointsConfig } from './wildrydes-api-endpoints.model';

export interface EnvironmentConfig {
  stage: EnvStage;
  aws: {
    region: EnvAWSRegion;
    cognito?: {
      userPoolId: string;
      userPoolClientId: string;
    };
    apiGateway?: {
      url: string;
      endpoints?: WildrydesApiEndpointsConfig;
    };
  };
}
