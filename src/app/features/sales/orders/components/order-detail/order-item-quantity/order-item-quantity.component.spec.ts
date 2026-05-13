import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemQuantityComponent } from './order-item-quantity.component';

describe('OrderItemQuantityComponent', () => {
  let component: OrderItemQuantityComponent;
  let fixture: ComponentFixture<OrderItemQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
