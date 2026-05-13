import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderClaimsTableComponent } from './order-claims-table.component';

describe('OrderClaimsTableComponent', () => {
  let component: OrderClaimsTableComponent;
  let fixture: ComponentFixture<OrderClaimsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderClaimsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderClaimsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
