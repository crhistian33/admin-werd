import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsTrashComponent } from './products-trash.component';

describe('ProductsTrashComponent', () => {
  let component: ProductsTrashComponent;
  let fixture: ComponentFixture<ProductsTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsTrashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
