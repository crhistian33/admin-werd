import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqReorderComponent } from './faq-reorder.component';

describe('FaqReorderComponent', () => {
  let component: FaqReorderComponent;
  let fixture: ComponentFixture<FaqReorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqReorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
