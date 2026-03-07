import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticpageFormComponent } from './staticpage-form.component';

describe('StaticpageFormComponent', () => {
  let component: StaticpageFormComponent;
  let fixture: ComponentFixture<StaticpageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticpageFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticpageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
