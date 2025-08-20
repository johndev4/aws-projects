import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallotPage } from './pages/ballot/ballot.page';
import { ViewReceiptPage } from './pages/view-receipt/view-receipt.page';
import { userHasVotedGuard } from './guard/user-has-voted.guard';

const routes: Routes = [
  {
    path: 'ballot/view-receipt',
    component: ViewReceiptPage,
  },
  {
    path: 'ballot',
    component: BallotPage,
    canActivate: [userHasVotedGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../pages/page-not-found/page-not-found.page').then(
        (c) => c.PageNotFoundPage
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotingRoutingModule {}
