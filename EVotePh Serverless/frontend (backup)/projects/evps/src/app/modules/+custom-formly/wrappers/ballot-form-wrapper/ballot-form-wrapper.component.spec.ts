import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotFormWrapperComponent } from './ballot-form-wrapper.component';

describe('BallotFormWrapperComponent', () => {
  let component: BallotFormWrapperComponent;
  let fixture: ComponentFixture<BallotFormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BallotFormWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallotFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
