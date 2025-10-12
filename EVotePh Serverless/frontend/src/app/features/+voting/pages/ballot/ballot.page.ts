import { Component, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import senatorialCandidates from '../../../../shared/data/senatorial-candidates';
import { VotingService } from '../../services/voting.service';
import { MatDialog } from '@angular/material/dialog';
import { VoteConfirmationDialog } from '../../dialogs/vote-confirmation/vote-confirmation.dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { WebCryptoService } from '../../../../shared/services/web-crypto.service';
import { mergeMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ballot',
  standalone: false,
  templateUrl: './ballot.page.html',
  styleUrl: './ballot.page.scss',
})
export class BallotPage implements OnInit {
  protected form = new FormGroup({});
  protected model: any = {};
  protected fields: FormlyFieldConfig[] = [];
  protected options: FormlyFormOptions = {};

  protected ballotContent!: any;

  isVoteLoading = signal(true);
  submitBtnIsDisabled = signal(true);

  constructor(
    private dialog: MatDialog,
    private votingService: VotingService,
    private webCryptoService: WebCryptoService,
    private oidcSecurityService: OidcSecurityService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isVoteLoading.set(false);
    this.fields = [
      {
        key: 'senatorial_candidates',
        fieldGroupClassName: 'd-flex flex-column',
        wrappers: ['custom-default-wrapper'],
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
      .open(VoteConfirmationDialog, {
        width: '800px',
        height: '90%',
        autoFocus: true,
        disableClose: true,
        data: { ballotContent: this.ballotContent },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm === true) {
          this.isVoteLoading.set(true);

          this.votingService
            .post({
              content: JSON.stringify(this.ballotContent),
            })
            .subscribe((response) => {
              if (response.success === true && response.data) {
                this.oidcSecurityService
                  .getUserData()
                  .pipe(
                    mergeMap((userData) =>
                      this.webCryptoService.hashWithSHA256(
                        userData.sub + JSON.stringify(this.ballotContent)
                      )
                    )
                  )
                  .subscribe((ballotContentHash) => {
                    if (response.data.ballot_id === ballotContentHash) {
                      const vote = {
                        ballotId: ballotContentHash,
                        ballotContent: this.ballotContent,
                      };
                      this.router.navigate(['/voting/ballot/view-receipt'], {
                        replaceUrl: true,
                        state: vote,
                      });
                    } else {
                      console.error('Ballot content hash mismatch');
                      this.snackBar
                        .open(
                          `Your vote was tampered. Your ballot ID is: ${ballotContentHash}`,
                          'Report this issue'
                        )
                        .afterDismissed()
                        .subscribe(() => {
                          /* Report the tampered ballot to the admin, then flag the ballot as tampered */
                        });
                    }
                  });
              }
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
