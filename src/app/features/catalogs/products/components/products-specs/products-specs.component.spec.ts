import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSpecsComponent } from './products-specs.component';

describe('ProductsSpecsComponent', () => {
  let component: ProductsSpecsComponent;
  let fixture: ComponentFixture<ProductsSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsSpecsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
