import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAreasComponent } from './shipping-areas.component';

describe('ShippingAreasComponent', () => {
  let component: ShippingAreasComponent;
  let fixture: ComponentFixture<ShippingAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingAreasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
