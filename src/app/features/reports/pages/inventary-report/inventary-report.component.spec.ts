import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventaryReportComponent } from './inventary-report.component';

describe('InventaryReportComponent', () => {
  let component: InventaryReportComponent;
  let fixture: ComponentFixture<InventaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
