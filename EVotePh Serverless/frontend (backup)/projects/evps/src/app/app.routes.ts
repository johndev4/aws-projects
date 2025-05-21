import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { userHasVotedGuard } from './core/guard/user-has-voted.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ballot/form',
  },
  {
    path: 'ballot',
    canActivate: [autoLoginPartialRoutesGuard],
    children: [
      {
        path: '',
        redirectTo: 'form',
        pathMatch: 'full',
      },
      {
        path: 'form',
        loadComponent: () =>
          import('./components/pages/ballot-form/ballot-form.component').then(
            (c) => c.BallotFormComponent
          ),
        canActivate: [userHasVotedGuard],
      },
      {
        path: 'receipt',
        loadComponent: () =>
          import(
            './components/pages/ballot-receipt/ballot-receipt.component'
          ).then((c) => c.BallotReceiptComponent),
        canActivate: [userHasVotedGuard],
      },
    ],
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
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/page-not-found/page-not-found.component').then(
        (c) => c.PageNotFoundComponent
      ),
  },
];
