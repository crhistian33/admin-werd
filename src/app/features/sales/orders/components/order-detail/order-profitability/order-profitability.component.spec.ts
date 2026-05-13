import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProfitabilityComponent } from './order-profitability.component';

describe('OrderProfitabilityComponent', () => {
  let component: OrderProfitabilityComponent;
  let fixture: ComponentFixture<OrderProfitabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProfitabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderProfitabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
