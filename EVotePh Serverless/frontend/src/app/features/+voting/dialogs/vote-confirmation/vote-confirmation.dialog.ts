import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vote-confirmation',
  standalone: false,
  templateUrl: './vote-confirmation.dialog.html',
  styleUrl: './vote-confirmation.dialog.scss',
})
export class VoteConfirmationDialog implements OnInit {
  protected displayedColumns!: string[];
  protected dataSource!: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VoteConfirmationDialog>
  ) {}

  ngOnInit(): void {
    this.displayedColumns = [
      'candidate_no',
      'candidate_name',
      'candidate_party',
    ];
    this.dataSource = [];

    Object.keys(this.data.ballotContent).forEach((k) => {
      this.data.ballotContent[k].forEach((v: any) => {
        this.dataSource.push({
          ...v,
          candidate_party: v.candidate_party.replace('(', '').replace(')', ''),
        });
      });
    });
    this.dataSource.sort((a, b) => a.candidate_no - b.candidate_no);
  }
}
