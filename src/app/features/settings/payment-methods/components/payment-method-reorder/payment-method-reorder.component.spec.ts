import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodReorderComponent } from './payment-method-reorder.component';

describe('PaymentMethodReorderComponent', () => {
  let component: PaymentMethodReorderComponent;
  let fixture: ComponentFixture<PaymentMethodReorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodReorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
