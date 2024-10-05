import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api-service.class';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UnicornResponse } from '../models/unicorn.model';

@Injectable()
export class UnicornService extends ApiService {
  constructor(private _http: HttpClient) {
    super();
  }

  requestUnicorn(data: any): Observable<UnicornResponse> {
    return this._http
      .post(this.buildRequestUrl({ endpoint: this.endpoints.ride }), data, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'body',
      })
      .pipe(map((response) => <UnicornResponse>response));
  }
}
