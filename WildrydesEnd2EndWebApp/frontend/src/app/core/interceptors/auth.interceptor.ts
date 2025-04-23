import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { CognitoAuthService } from '../services/cognito-auth.service';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, from, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const handle = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const _snackBar = inject(MatSnackBar);
  const cognitoAuthService = inject(CognitoAuthService);
  let newReq = req;

  return from(cognitoAuthService.getCurrentSession()).pipe(
    switchMap((currentSession) => {
      if (
        currentSession?.idToken?.toString() &&
        req.url.includes(<string>environment.aws.apiGateway?.url)
      ) {
        newReq = req.clone({
          headers: req.headers.set(
            'Authorization',
            currentSession.idToken.toString()
          ),
        });
      }
      return next(newReq);
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle the error appropriately here
      _snackBar.open('Something went wrong', 'Dismiss');
      console.error('Error in HTTP request', error);
      return throwError(() => new Error(error.message));
    })
  );
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(handle(req, next));
};
