import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userHasVotedGuard } from './user-has-voted.guard';

describe('userHasVotedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userHasVotedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
