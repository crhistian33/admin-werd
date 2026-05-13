import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecentClaimsComponent } from './dashboard-recent-claims.component';

describe('DashboardRecentClaimsComponent', () => {
  let component: DashboardRecentClaimsComponent;
  let fixture: ComponentFixture<DashboardRecentClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecentClaimsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRecentClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
