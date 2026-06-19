import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationArticle } from './validation-article';

describe('ValidationArticle', () => {
  let component: ValidationArticle;
  let fixture: ComponentFixture<ValidationArticle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationArticle],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationArticle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
