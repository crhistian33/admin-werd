import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSlideReorderComponent } from './hero-slide-reorder.component';

describe('HeroSlideReorderComponent', () => {
  let component: HeroSlideReorderComponent;
  let fixture: ComponentFixture<HeroSlideReorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSlideReorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSlideReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
