import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRevenueChartComponent } from './dashboard-revenue-chart.component';

describe('DashboardRevenueChartComponent', () => {
  let component: DashboardRevenueChartComponent;
  let fixture: ComponentFixture<DashboardRevenueChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRevenueChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRevenueChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
