import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderClaimReviewDialogComponent } from './order-claim-review-dialog.component';

describe('OrderClaimReviewDialogComponent', () => {
  let component: OrderClaimReviewDialogComponent;
  let fixture: ComponentFixture<OrderClaimReviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderClaimReviewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderClaimReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
