import { Observable } from 'rxjs';

export interface IApiService<T> {
  post(body: any, query?: Map<string, string>, params?: any): Observable<any>;
  update(body: any, query?: Map<string, string>, params?: any): Observable<any>;
  delete(body: any, query?: Map<string, string>, params?: any): Observable<any>;
  get(id: string, query?: Map<string, string>): Observable<T>;
  getList(query?: Map<string, string>): Observable<T[]>;
  search(query: Map<string, string>): Observable<T[]>;
}
