import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-receipt',
  standalone: false,
  templateUrl: './view-receipt.page.html',
  styleUrl: './view-receipt.page.scss',
})
export class ViewReceiptPage implements OnInit {
  protected displayedColumns!: string[];
  protected dataSource!: any[];

  ngOnInit(): void {
    this.displayedColumns = [
      'candidate_no',
      'candidate_name',
      'candidate_party',
    ];
    this.dataSource = [];

    // Object.keys(this.data.ballotContent).forEach((k) => {
    //   this.data.ballotContent[k].forEach((v: any) => {
    //     this.dataSource.push({
    //       ...v,
    //       candidate_party: v.candidate_party.replace('(', '').replace(')', ''),
    //     });
    //   });
    // });
    // this.dataSource.sort((a, b) => a.candidate_no - b.candidate_no);
  }
}
