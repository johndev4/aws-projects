import { Component, ElementRef, ViewChild } from '@angular/core';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Router } from '@angular/router';
import { BallotContent, VoteCategory } from '../../models/vote.model';

@Component({
  selector: 'app-view-receipt',
  standalone: false,
  templateUrl: './view-receipt.page.html',
  styleUrl: './view-receipt.page.scss',
})
export class ViewReceiptPage {
  @ViewChild('receiptRef', { static: false }) receiptElement!: ElementRef;

  currentDate = new Date();

  voteCategories: VoteCategory[] = [];

  ballotId!: string;
  ballotContent!: BallotContent;

  constructor(private router: Router) {
    this.ballotId =
      this.router.getCurrentNavigation()?.extras.state?.['ballotId'] || null;
    this.ballotContent =
      this.router.getCurrentNavigation()?.extras.state?.['ballotContent'] ?? {};

    // console.log('ballotId:', this.ballotId);
    // console.log('ballotContent:', this.ballotContent);

    if (!this.ballotId || !Object.keys(this.ballotContent)?.length) {
      this.router.navigate(['/home'], { replaceUrl: true });
      return;
    }

    Object.keys(this.ballotContent).forEach((key) => {
      if (key === 'senatorial_candidates') {
        this.voteCategories.push({
          name: 'Senators',
          candidates: this.ballotContent[key].map(
            (c) => `#${c.candidate_no} ${c.candidate_name} ${c.candidate_party}`
          ),
        });
      }
    });
  }

  downloadPdf() {
    const options = {
      margin: 0.3,
      filename: 'vote-receipt.pdf',
      image: { type: 'jpeg', quality: 100 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: [4, 15], orientation: 'portrait' }, // Simulating receipt width
    };

    html2pdf().from(this.receiptElement.nativeElement).set(options).save();
  }
}
