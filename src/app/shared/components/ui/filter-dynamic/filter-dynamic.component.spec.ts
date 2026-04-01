import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDynamicComponent } from './filter-dynamic.component';

describe('FilterDynamicComponent', () => {
  let component: FilterDynamicComponent;
  let fixture: ComponentFixture<FilterDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDynamicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
