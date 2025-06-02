import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authConfig } from './core/config/auth.config';
import {
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
