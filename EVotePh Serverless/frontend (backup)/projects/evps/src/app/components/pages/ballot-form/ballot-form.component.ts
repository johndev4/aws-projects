import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import senatorialCandidates from './data/senatorial-candidates';
import { CastedVotesConfirmationComponent } from '../../dialogs/casted-votes-confirmation/casted-votes-confirmation.component';
import { MatButton } from '@angular/material/button';
import { MatAccordion } from '@angular/material/expansion';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CustomFormlyModule } from '../../../modules/+custom-formly/custom-formly.module';
import { Router } from '@angular/router';
import { BallotService } from '../../../services/ballot.service';

@Component({
  selector: 'app-ballot-form',
  providers: [BallotService],
  imports: [
    CustomFormlyModule,
    ReactiveFormsModule,
    MatAccordion,
    MatButton,
    MatProgressBar,
  ],
  standalone: true,
  templateUrl: './ballot-form.component.html',
  styleUrl: './ballot-form.component.scss',
})
export class BallotFormComponent implements OnInit {
  protected form = new FormGroup({});
  protected model: any = {};
  protected fields: FormlyFieldConfig[] = [];
  protected options: FormlyFormOptions = {};

  protected ballotContent!: any;

  isUserVoteCasted = signal(true);
  submitBtnIsDisabled = signal(true);

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private ballotService: BallotService
  ) {}

  ngOnInit(): void {
    this.isUserVoteCasted.set(false);
    this.fields = [
      {
        key: 'senatorial_candidates',
        fieldGroupClassName: 'd-flex flex-column',
        wrappers: ['custom-ballot-form-wrapper'],
        props: {
          label: 'Senators',
          description: '(Vote for 12)',
          accordion_expanded: true,
        },
        fieldGroup: senatorialCandidates.map((c) => ({
          className: 'col-6',
          key: `${c.candidate_no}_${c.candidate_name}_(${c.candidate_party})`,
          defaultValue: false,
          type: 'custom-checkbox',
          props: {
            label: `#${c.candidate_no}. ${c.candidate_name} (${c.candidate_party})`,
          },
          expressions: {
            'props.disabled': (field) => {
              const model = field.formControl?.getRawValue();
              const parentModel =
                field.parent?.formControl?.getRawValue() ?? {};
              const hasMaximumSelectedCandidates =
                Object.keys(parentModel).filter((k) => parentModel[k] === true)
                  .length >= 12;
              return hasMaximumSelectedCandidates && model === false;
            },
          },
        })),
      },
    ];
  }

  protected onSubmit(): void {
    // console.log(this.ballotContent);
    this.dialog
      .open(CastedVotesConfirmationComponent, {
        width: '800px',
        height: '90%',
        autoFocus: true,
        disableClose: true,
        data: { ballotContent: this.ballotContent },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm === true) {
          this.isUserVoteCasted.set(true);

          this.ballotService
            .post({
              content: JSON.stringify(this.ballotContent),
            })
            .subscribe({
              next: (response) => {
                console.log(response);
                if (response.status == 200 && response.ok === true) {
                  this.router.navigate(['/ballot/receipt'], {
                    // skipLocationChange: true,
                    replaceUrl: true,
                  });
                }
              },
              error: (error) => {
                console.error(error);
                this.isUserVoteCasted.set(false);
              },
            });
        }
      });
  }

  protected onModelChange(): void {
    this.submitBtnIsDisabled.update(() => {
      this.ballotContent = {};
      Object.keys(this.model).forEach((k) => {
        this.ballotContent[k] = Object.keys(this.model[k])
          .filter((kk) => this.model[k][kk] === true)
          .map((kk) => {
            const [candidate_no, candidate_name, candidate_party] =
              kk.split('_') ?? [];
            return { candidate_no, candidate_name, candidate_party };
          });
      });

      const hasNoSelectedCandidates = Object.keys(this.ballotContent).every(
        (k) => this.ballotContent[k].length === 0
      );

      return hasNoSelectedCandidates;
    });
  }
}
