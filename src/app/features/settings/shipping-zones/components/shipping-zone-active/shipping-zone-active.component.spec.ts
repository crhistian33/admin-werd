import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingZoneActiveComponent } from './shipping-zone-active.component';

describe('ShippingZoneActiveComponent', () => {
  let component: ShippingZoneActiveComponent;
  let fixture: ComponentFixture<ShippingZoneActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingZoneActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingZoneActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
