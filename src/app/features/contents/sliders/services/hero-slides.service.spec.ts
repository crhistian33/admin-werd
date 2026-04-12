import { TestBed } from '@angular/core/testing';

import { HeroSlidesService } from './hero-slides.service';

describe('HeroSlidesService', () => {
  let service: HeroSlidesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroSlidesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
