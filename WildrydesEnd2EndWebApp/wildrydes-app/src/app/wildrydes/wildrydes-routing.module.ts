import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticatorGuard } from '../core/guards/authenticator.guard';
import { anonymousGuard } from '../core/guards/anonymous.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'wildrydes/map',
  },
  {
    path: 'wildrydes/map',
    loadComponent: () =>
      import('./pages/wildrydes-map/wildrydes-map.component').then(
        (c) => c.WildrydesMapComponent
      ),
    canActivate: [authenticatorGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((c) => c.AuthComponent), // This component will prevent to load the WildrydesMapComponent
    canActivate: [anonymousGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WildrydesRoutingModule {}
