import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceListComponent } from './conference-list';

describe('ConferenceList', () => {
  let component: ConferenceListComponent;
  let fixture: ComponentFixture<ConferenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
