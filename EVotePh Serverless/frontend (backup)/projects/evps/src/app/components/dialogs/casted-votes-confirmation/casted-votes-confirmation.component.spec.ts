import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastedVotesConfirmationComponent } from './casted-votes-confirmation.component';

describe('CastedVotesConfirmationComponent', () => {
  let component: CastedVotesConfirmationComponent;
  let fixture: ComponentFixture<CastedVotesConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CastedVotesConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastedVotesConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
