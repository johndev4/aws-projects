import { Routes } from '@angular/router';
import { publicHomeRedirectGuard } from './core/guards/public-home-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [publicHomeRedirectGuard],
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./wildrydes/wildrydes.module').then((m) => m.WildrydesModule),
  },
];
