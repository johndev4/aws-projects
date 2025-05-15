import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'voting/ballot',
  },
  {
    path: 'voting',
    canActivate: [],
    loadChildren: () =>
      import('./features/+voting/voting.module').then((m) => m.VotingModule),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/pages/auth-callback.page').then((c) => c.AuthCallbackPage),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/pages/unauthorized/unauthorized.page').then(
        (c) => c.UnauthorizedPage
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/page-not-found/page-not-found.page').then(
        (c) => c.PageNotFoundPage
      ),
  },
];
