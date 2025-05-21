import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallotPage } from './pages/ballot/ballot.page';
import { ViewReceiptPage } from './pages/view-receipt/view-receipt.page';

const routes: Routes = [
  {
    path: 'ballot/view-receipt',
    component: ViewReceiptPage,
  },
  {
    path: 'ballot',
    component: BallotPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotingRoutingModule {}
