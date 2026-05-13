import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTransactionsComponent } from './order-transactions.component';

describe('OrderTransactionsComponent', () => {
  let component: OrderTransactionsComponent;
  let fixture: ComponentFixture<OrderTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
