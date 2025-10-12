import { Observable, throwError } from 'rxjs';
import { IApiService } from '../interfaces/api-service.interface';

interface BuildRequestUrlParameters {
  endpoint: string;
  params?: {
    [path: string]: string | number;
  };
  query?: {
    [path: string]: string | number;
  };
}

export abstract class ApiService<T> implements IApiService<T> {
  constructor(public baseUrl: string) {}

  abstract rootEndpoint: { [key: string]: any };
  abstract post(
    body: any,
    query?: Map<string, string>,
    params?: any
  ): Observable<any>;
  abstract update(
    body: any,
    query?: Map<string, string>,
    params?: any
  ): Observable<any>;
  abstract delete(
    body: any,
    query?: Map<string, string>,
    params?: any
  ): Observable<any>;
  abstract get(id: string, query?: Map<string, string>): Observable<T>;
  abstract getList(query?: Map<string, string>): Observable<T[]>;
  abstract search(query: Map<string, string>): Observable<T[]>;

  protected handleError(error: any) {
    let errorMessage: string;
    if (error.error) {
      errorMessage = `An error occured: ${error.error.message}`;
    } else {
      errorMessage = `Server returned ${error?.status}: ${error?.message}`;
    }
    return throwError(errorMessage);
  }

  protected buildRequestUrl({
    params,
    query,
    endpoint,
  }: BuildRequestUrlParameters): string {
    const url = new URL('', this.baseUrl);
    let path = `${this.baseUrl?.split('/')?.pop() + '/'}${endpoint}`;

    if (params) {
      Object.keys(params).forEach((pathParamKey) => {
        path = path.replace(`:${pathParamKey}:`, `${params[pathParamKey]}`);
      });
    }

    url.pathname = path.replace(/\/\//g, '/');

    if (query) {
      Object.keys(query).forEach((queryKey) => {
        url.searchParams.append(`${queryKey}`, `${query[queryKey]}`);
      });
    }

    return url.toString();
  }
}
