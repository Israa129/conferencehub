import { TestBed } from '@angular/core/testing';

import { SessionConference } from './session-conference';

describe('SessionConference', () => {
  let service: SessionConference;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionConference);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
