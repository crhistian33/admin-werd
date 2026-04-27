import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRefundDialogComponentComponent } from './process-refund-dialog.component.component';

describe('ProcessRefundDialogComponentComponent', () => {
  let component: ProcessRefundDialogComponentComponent;
  let fixture: ComponentFixture<ProcessRefundDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessRefundDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessRefundDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
