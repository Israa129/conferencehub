import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPrivacy } from './settings-privacy';

describe('SettingsPrivacy', () => {
  let component: SettingsPrivacy;
  let fixture: ComponentFixture<SettingsPrivacy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPrivacy],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPrivacy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
