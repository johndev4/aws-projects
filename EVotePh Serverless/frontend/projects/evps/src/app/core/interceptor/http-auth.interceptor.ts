import { HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, from, of, switchMap, tap, throwError } from 'rxjs';

export const httpAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const snackbar = inject(MatSnackBar);

  return from(oidcSecurityService.getIdToken()).pipe(
    switchMap((token) => {
      // Extract expiration from token
      const tokenParts = token?.split('.');
      const tokenPayload = tokenParts?.[1]
        ? JSON.parse(atob(tokenParts[1]))
        : null;
      const expiration = tokenPayload?.exp;
      console.log('token expiration', expiration);
      const authReq = token
        ? req.clone({
            headers: req.headers.set('Authorization', `${token}`),
          })
        : req;

      return next(authReq);
    }),
    catchError((error) => {
      snackbar.open('Something went wrong.', 'Dismiss', { duration: 10000 });
      throw error;
    })
  );
};
