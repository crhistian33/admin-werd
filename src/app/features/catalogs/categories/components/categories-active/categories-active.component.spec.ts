import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesActiveComponent } from './categories-active.component';

describe('CategoriesActiveComponent', () => {
  let component: CategoriesActiveComponent;
  let fixture: ComponentFixture<CategoriesActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
