import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkClaimReceivedDialogComponent } from './mark-claim-received-dialog.component';

describe('MarkClaimReceivedDialogComponent', () => {
  let component: MarkClaimReceivedDialogComponent;
  let fixture: ComponentFixture<MarkClaimReceivedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkClaimReceivedDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkClaimReceivedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
