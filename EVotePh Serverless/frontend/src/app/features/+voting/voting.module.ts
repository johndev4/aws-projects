import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VotingRoutingModule } from './voting-routing.module';
import { BallotPage } from './pages/ballot/ballot.page';
import { ViewReceiptPage } from './pages/view-receipt/view-receipt.page';
import { CustomFormlyModule } from '../../shared/modules/custom-formly/custom-formly.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatAccordion } from '@angular/material/expansion';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { VotingService } from './services/voting.service';
import { VoteConfirmationDialog } from './dialogs/vote-confirmation/vote-confirmation.dialog';
import { NgxQrcodeStylingComponent } from 'ngx-qrcode-styling';

@NgModule({
  declarations: [BallotPage, ViewReceiptPage, VoteConfirmationDialog],
  imports: [
    CommonModule,
    VotingRoutingModule,
    CustomFormlyModule,
    ReactiveFormsModule,
    MatAccordion,
    MatButton,
    MatProgressBar,
    MatTableModule,
    MatDialogModule,
    NgxQrcodeStylingComponent,
  ],
  providers: [VotingService],
})
export class VotingModule {}
