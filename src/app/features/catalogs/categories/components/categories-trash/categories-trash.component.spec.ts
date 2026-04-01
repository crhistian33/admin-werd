import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesTrashComponent } from './categories-trash.component';

describe('CategoriesTrashComponent', () => {
  let component: CategoriesTrashComponent;
  let fixture: ComponentFixture<CategoriesTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesTrashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
