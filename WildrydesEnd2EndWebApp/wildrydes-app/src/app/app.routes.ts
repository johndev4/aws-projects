import { Routes } from '@angular/router';
import { publicHomeRedirectGuard } from './core/guards/public-home-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'wildrydes',
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./wildrydes/wildrydes.module').then((m) => m.WildrydesModule),
  },
  {
    path: 'wildrydes',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [publicHomeRedirectGuard],
  },
];
