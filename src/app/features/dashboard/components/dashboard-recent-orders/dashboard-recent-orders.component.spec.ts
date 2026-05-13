import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecentOrdersComponent } from './dashboard-recent-orders.component';

describe('DashboardRecentOrdersComponent', () => {
  let component: DashboardRecentOrdersComponent;
  let fixture: ComponentFixture<DashboardRecentOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecentOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRecentOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
