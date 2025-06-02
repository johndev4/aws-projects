import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export const httpAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const snackbar = inject(MatSnackBar);

  // console.log('requst URL:', req.url);

  if (!req.url.startsWith(environment.api.url)) {
    return next(req).pipe(
      catchError((error) => {
        snackbar
          .open('Something went wrong.', 'Reload')
          .afterDismissed()
          .subscribe(() => window.location.reload());
        throw error;
      })
    );
  }

  return from(oidcSecurityService.getAccessToken()).pipe(
    switchMap((token) => {
      // Extract expiration from token
      // const tokenParts = token?.split('.');
      // const tokenPayload = tokenParts?.[1]
      //   ? JSON.parse(atob(tokenParts[1]))
      //   : null;
      // const expiration = tokenPayload?.exp;
      // console.log('token expiration', expiration);

      const authReq = token
        ? req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          })
        : req;

      return next(authReq);
    }),
    catchError((error) => {
      snackbar
        .open('Something went wrong.', 'Reload')
        .afterDismissed()
        .subscribe(() => window.location.reload());
      throw error;
    })
  );
};
