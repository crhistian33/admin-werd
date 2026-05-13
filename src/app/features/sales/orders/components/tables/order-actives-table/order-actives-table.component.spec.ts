import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActivesTableComponent } from './order-actives-table.component';

describe('OrderActivesTableComponent', () => {
  let component: OrderActivesTableComponent;
  let fixture: ComponentFixture<OrderActivesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderActivesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderActivesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
