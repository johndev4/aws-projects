import { CanActivateFn } from '@angular/router';

export const userHasVotedGuard: CanActivateFn = (route, state) => {
  return true;
};
