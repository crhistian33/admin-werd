import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingZoneFormComponent } from './shipping-zone-form.component';

describe('ShippingFormComponent', () => {
  let component: ShippingZoneFormComponent;
  let fixture: ComponentFixture<ShippingZoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingZoneFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingZoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
