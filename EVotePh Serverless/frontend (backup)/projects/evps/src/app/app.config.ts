import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authConfig } from './core/auth/auth.config';
import {
  authInterceptor,
  provideAuth,
  withAppInitializerAuthCheck,
} from 'angular-auth-oidc-client';
import { httpAuthInterceptor } from './core/interceptor/http-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpAuthInterceptor])),
    provideAuth(authConfig, withAppInitializerAuthCheck()),
  ],
};
