import { TestBed } from '@angular/core/testing';

import { PasswortResetService } from './passwort-reset.service';

describe('PasswortResetService', () => {
  let service: PasswortResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswortResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
