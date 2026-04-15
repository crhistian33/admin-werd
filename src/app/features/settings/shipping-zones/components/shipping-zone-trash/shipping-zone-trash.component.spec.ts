import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingZoneTrashComponent } from './shipping-zone-trash.component';

describe('ShippingZoneTrashComponent', () => {
  let component: ShippingZoneTrashComponent;
  let fixture: ComponentFixture<ShippingZoneTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingZoneTrashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingZoneTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
