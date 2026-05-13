import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOrdersByStatusComponent } from './dashboard-orders-by-status.component';

describe('DashboardOrdersByStatusComponent', () => {
  let component: DashboardOrdersByStatusComponent;
  let fixture: ComponentFixture<DashboardOrdersByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOrdersByStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOrdersByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
