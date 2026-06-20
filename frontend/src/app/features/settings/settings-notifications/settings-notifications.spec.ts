import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNotifications } from './settings-notifications';

describe('SettingsNotifications', () => {
  let component: SettingsNotifications;
  let fixture: ComponentFixture<SettingsNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsNotifications],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsNotifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
