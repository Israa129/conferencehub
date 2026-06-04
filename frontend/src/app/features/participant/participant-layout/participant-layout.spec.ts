import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantLayout } from './participant-layout';

describe('ParticipantLayout', () => {
  let component: ParticipantLayout;
  let fixture: ComponentFixture<ParticipantLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
