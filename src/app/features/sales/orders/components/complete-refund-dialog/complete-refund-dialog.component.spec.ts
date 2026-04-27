import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRefundDialogComponent } from './complete-refund-dialog.component';

describe('CompleteRefundDialogComponent', () => {
  let component: CompleteRefundDialogComponent;
  let fixture: ComponentFixture<CompleteRefundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteRefundDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteRefundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
