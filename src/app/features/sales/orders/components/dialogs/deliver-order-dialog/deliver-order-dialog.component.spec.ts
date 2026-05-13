import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverOrderDialogComponent } from './deliver-order-dialog.component';

describe('DeliverOrderDialogComponent', () => {
  let component: DeliverOrderDialogComponent;
  let fixture: ComponentFixture<DeliverOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverOrderDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
