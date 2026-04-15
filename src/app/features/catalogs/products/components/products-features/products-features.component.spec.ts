import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFeaturesComponent } from './products-features.component';

describe('ProductsFeaturesComponent', () => {
  let component: ProductsFeaturesComponent;
  let fixture: ComponentFixture<ProductsFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
