import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLinksManagerComponent } from './social-links-manager.component';

describe('SocialLinksManagerComponent', () => {
  let component: SocialLinksManagerComponent;
  let fixture: ComponentFixture<SocialLinksManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLinksManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialLinksManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
