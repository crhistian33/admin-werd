import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderDynamicComponent } from './reorder-dynamic.component';

describe('ReorderDynamicComponent', () => {
  let component: ReorderDynamicComponent;
  let fixture: ComponentFixture<ReorderDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReorderDynamicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReorderDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
