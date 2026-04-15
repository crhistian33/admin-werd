import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingZoneListComponent } from './shipping-zone-list.component';

describe('ShippingZoneListComponent', () => {
  let component: ShippingZoneListComponent;
  let fixture: ComponentFixture<ShippingZoneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingZoneListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingZoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
