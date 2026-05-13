import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderClaimsComponent } from './order-claims.component';

describe('OrderClaimsComponent', () => {
  let component: OrderClaimsComponent;
  let fixture: ComponentFixture<OrderClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderClaimsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
