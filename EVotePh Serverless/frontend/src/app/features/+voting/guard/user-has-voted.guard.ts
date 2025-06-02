import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { VotingService } from '../services/voting.service';
import { map } from 'rxjs';

export const userHasVotedGuard: CanActivateFn = (route, state) => {
  const votingService = inject(VotingService);
  return votingService
    .checkIfUserHasVoted()
    .pipe(map((result: any) => result.userHasVoted === false));
};
