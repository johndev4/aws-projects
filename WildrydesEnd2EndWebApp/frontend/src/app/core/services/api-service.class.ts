import { environment } from '../../../environments/environment';
import { BuildRequestUrlParameters } from '../models/api-service';
import { WildrydesApiEndpointsConfig } from '../models/wildrydes-api-endpoints.model';

export class ApiService {
  private _baseUrl!: string;
  public endpoints!: WildrydesApiEndpointsConfig;

  constructor() {
    if (environment.aws.apiGateway) {
      if (environment.aws.apiGateway.url)
        this._baseUrl = environment.aws.apiGateway.url;
      if (environment.aws.apiGateway.endpoints)
        this.endpoints = environment.aws.apiGateway.endpoints;
    }
  }

  protected buildRequestUrl({
    endpoint,
    params,
    query,
  }: BuildRequestUrlParameters): string {
    let path = `${endpoint}`;

    if (params) {
      Object.keys(params).forEach((pathParamKey) => {
        path = path.replace(`:${pathParamKey}:`, `${params[pathParamKey]}`);
      });
    }

    if (query) {
      path += '?';
      path += Object.keys(query)
        .map((queryKey) => `${queryKey}=${query[queryKey]}`)
        .join('&');
    }

    return this._baseUrl + path;
  }
}
