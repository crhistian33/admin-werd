import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReturnShipmentDialogComponent } from './confirm-return-shipment-dialog.component';

describe('ConfirmReturnShipmentDialogComponent', () => {
  let component: ConfirmReturnShipmentDialogComponent;
  let fixture: ComponentFixture<ConfirmReturnShipmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmReturnShipmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmReturnShipmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
