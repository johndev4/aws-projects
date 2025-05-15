import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteConfirmationDialog } from './vote-confirmation.dialog';

describe('VoteConfirmationDialog', () => {
  let component: VoteConfirmationDialog;
  let fixture: ComponentFixture<VoteConfirmationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoteConfirmationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteConfirmationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
