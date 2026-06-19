import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisateurDashboard } from './organisateur-dashboard';

describe('OrganisateurDashboard', () => {
  let component: OrganisateurDashboard;
  let fixture: ComponentFixture<OrganisateurDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisateurDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisateurDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
