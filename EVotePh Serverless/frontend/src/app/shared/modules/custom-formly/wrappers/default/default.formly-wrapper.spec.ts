import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFormlyWrapper } from './default.formly-wrapper';

describe('DefaultFormlyWrapper', () => {
  let component: DefaultFormlyWrapper;
  let fixture: ComponentFixture<DefaultFormlyWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultFormlyWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultFormlyWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
