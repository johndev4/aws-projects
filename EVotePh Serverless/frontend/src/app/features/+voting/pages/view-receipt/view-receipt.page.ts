import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BallotService } from '../../services/ballot.service';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-view-receipt',
  standalone: false,
  templateUrl: './view-receipt.page.html',
  styleUrl: './view-receipt.page.scss',
})
export class ViewReceiptPage implements OnInit {
  @ViewChild('receiptRef', { static: false }) receiptElement!: ElementRef;

  currentDate = new Date();

  voteCategories = [
    {
      name: 'Senators',
      candidates: ['Jane Doe', 'John Smith', 'Maria Clara'],
    },
    {
      name: 'Partylist',
      candidates: ['Youth United', 'Green Future'],
    },
    {
      name: 'President',
      candidates: ['Leo Reyes'],
    },
  ];

  voteHash = '7b9f3e2a1c4d9abc...'; // Replace with actual generated hash

  signedBy = 'juan.delacruz@votermail.com'; // Can use Cognito identity
  digitalSignature = 'f3a9b8d7e6... (truncated)'; // Use real digital signature if available

  constructor(private ballotService: BallotService) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.ballotService.get().subscribe((data) => {
      console.log(data);
    });
  }

  downloadPdf() {
    const options = {
      margin: 0.3,
      filename: 'vote-receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: [3.5, 11], orientation: 'portrait' }, // Simulating receipt width
    };

    html2pdf().from(this.receiptElement.nativeElement).set(options).save();
  }
}
