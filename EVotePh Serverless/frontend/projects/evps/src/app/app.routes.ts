import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guard/authenticated.guard';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ballot/form',
  },
  {
    path: 'ballot/form',
    loadComponent: () =>
      import('./components/pages/ballot-form/ballot-form.component').then(
        (c) => c.BallotFormComponent
      ),
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: 'personal/cloud-storage',
    loadComponent: () =>
      import(
        './components/pages/personal-storage/personal-storage.component'
      ).then((c) => c.PersonalStorageComponent),
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/auth/auth.callback').then((c) => c.AuthCallback),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/pages/unauthorized/unauthorized.component').then(
        (c) => c.UnauthorizedComponent
      ),
  },
];
