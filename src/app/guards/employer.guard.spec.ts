import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { employerGuard } from './employer.guard';

describe('employerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => employerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
