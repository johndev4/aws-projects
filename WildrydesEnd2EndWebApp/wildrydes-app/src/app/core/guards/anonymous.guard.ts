import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

export const anonymousGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticator = inject(AuthenticatorService);

  return new Promise((resolve, reject) => {
    try {
      authenticator.subscribe((state) => {
        let isAuthenticated =
          state.authStatus === 'authenticated'
            ? true
            : state.authStatus === 'unauthenticated'
            ? false
            : 'configuring';
        console.log('Auth Status:', isAuthenticated ? '✅' : '❌');

        if (isAuthenticated === true) {
          router.navigateByUrl('app/wildrydes/map');
          resolve(false);
        }

        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
};
