import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDisplay } from './settings-display';

describe('SettingsDisplay', () => {
  let component: SettingsDisplay;
  let fixture: ComponentFixture<SettingsDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
