import { Routes } from '@angular/router';
import { publicHomeRedirectGuard } from './core/guards/public-home-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./wildrydes/wildrydes.module').then((m) => m.WildrydesModule),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [publicHomeRedirectGuard],
  },
];
