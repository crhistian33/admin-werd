import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDynamicComponent } from './form-dynamic.component';

describe('FormDynamicComponent', () => {
  let component: FormDynamicComponent;
  let fixture: ComponentFixture<FormDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDynamicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
