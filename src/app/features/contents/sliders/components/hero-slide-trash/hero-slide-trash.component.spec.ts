import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSlideTrashComponent } from './hero-slide-trash.component';

describe('HeroSlideTrashComponent', () => {
  let component: HeroSlideTrashComponent;
  let fixture: ComponentFixture<HeroSlideTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSlideTrashComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSlideTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
