import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotReceiptComponent } from './ballot-receipt.component';

describe('BallotReceiptComponent', () => {
  let component: BallotReceiptComponent;
  let fixture: ComponentFixture<BallotReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BallotReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallotReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
