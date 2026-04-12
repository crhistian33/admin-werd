import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSlideActiveComponent } from './hero-slide-active.component';

describe('HeroSlideActiveComponent', () => {
  let component: HeroSlideActiveComponent;
  let fixture: ComponentFixture<HeroSlideActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSlideActiveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSlideActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
