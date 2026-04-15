import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingZoneDetailComponent } from './shipping-zone-detail.component';

describe('ShippingZoneDetailComponent', () => {
  let component: ShippingZoneDetailComponent;
  let fixture: ComponentFixture<ShippingZoneDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingZoneDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingZoneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
