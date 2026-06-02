import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceFormulaire } from './conference-formulaire';

describe('ConferenceFormulaire', () => {
  let component: ConferenceFormulaire;
  let fixture: ComponentFixture<ConferenceFormulaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceFormulaire],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceFormulaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
