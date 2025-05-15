import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotFormComponent } from './ballot-form.component';

describe('BallotFormComponent', () => {
  let component: BallotFormComponent;
  let fixture: ComponentFixture<BallotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BallotFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
