import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemTotalComponent } from './order-item-total.component';

describe('OrderItemTotalComponent', () => {
  let component: OrderItemTotalComponent;
  let fixture: ComponentFixture<OrderItemTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemTotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
