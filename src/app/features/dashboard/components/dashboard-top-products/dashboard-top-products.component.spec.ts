import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopProductsComponent } from './dashboard-top-products.component';

describe('DashboardTopProductsComponent', () => {
  let component: DashboardTopProductsComponent;
  let fixture: ComponentFixture<DashboardTopProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTopProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTopProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
