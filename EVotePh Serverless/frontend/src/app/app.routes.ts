import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [autoLoginPartialRoutesGuard],
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
      import('./pages/auth/auth.page').then((c) => c.AuthPage),
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.page').then(
        (c) => c.UnauthorizedPage
      ),
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found.page').then(
        (c) => c.PageNotFoundPage
      ),
  },
];
