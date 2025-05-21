import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'voting/ballot',
  },
  {
    path: 'voting',
    loadChildren: () =>
      import('./features/+voting/voting.module').then((m) => m.VotingModule),
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/pages/auth-callback.page').then((c) => c.AuthCallbackPage),
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/pages/unauthorized/unauthorized.page').then(
        (c) => c.UnauthorizedPage
      ),
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/page-not-found/page-not-found.page').then(
        (c) => c.PageNotFoundPage
      ),
  },
];
