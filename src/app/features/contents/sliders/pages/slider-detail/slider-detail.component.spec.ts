import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderDetailComponent } from './slider-detail.component';

describe('SliderDetailComponent', () => {
  let component: SliderDetailComponent;
  let fixture: ComponentFixture<SliderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
