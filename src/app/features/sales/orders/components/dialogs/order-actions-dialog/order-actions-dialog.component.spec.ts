import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActionsDialogComponent } from './order-actions-dialog.component';

describe('OrderActionsDialogComponent', () => {
  let component: OrderActionsDialogComponent;
  let fixture: ComponentFixture<OrderActionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderActionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderActionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
