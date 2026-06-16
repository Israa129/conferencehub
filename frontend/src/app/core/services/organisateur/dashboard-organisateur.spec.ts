import { TestBed } from '@angular/core/testing';

import { DashboardOrganisateur } from '../dashboard-organisateur';

describe('DashboardOrganisateur', () => {
  let service: DashboardOrganisateur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardOrganisateur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
