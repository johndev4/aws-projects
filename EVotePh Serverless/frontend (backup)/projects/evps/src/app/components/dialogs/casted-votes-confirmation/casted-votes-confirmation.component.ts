import { Component, Inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-casted-votes-confirmation',
  imports: [MatDialogModule, MatTableModule, MatButton],
  standalone: true,
  templateUrl: './casted-votes-confirmation.component.html',
  styleUrl: './casted-votes-confirmation.component.scss',
})
export class CastedVotesConfirmationComponent implements OnInit {
  protected displayedColumns!: string[];
  protected dataSource!: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CastedVotesConfirmationComponent>
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
