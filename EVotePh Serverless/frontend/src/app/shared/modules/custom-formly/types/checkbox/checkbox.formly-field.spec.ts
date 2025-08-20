import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxFormlyField } from './checkbox.formly-field';

describe('CheckboxFormlyField', () => {
  let component: CheckboxFormlyField;
  let fixture: ComponentFixture<CheckboxFormlyField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxFormlyField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxFormlyField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
