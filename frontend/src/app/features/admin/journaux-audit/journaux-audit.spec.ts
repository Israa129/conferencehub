import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournauxAudit } from './journaux-audit';

describe('JournauxAudit', () => {
  let component: JournauxAudit;
  let fixture: ComponentFixture<JournauxAudit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournauxAudit],
    }).compileComponents();

    fixture = TestBed.createComponent(JournauxAudit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
