import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodDetailComponent } from './payment-method-detail.component';

describe('PaymentMethodDetailComponent', () => {
  let component: PaymentMethodDetailComponent;
  let fixture: ComponentFixture<PaymentMethodDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMethodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
