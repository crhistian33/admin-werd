import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayDetailComponent } from './pay-detail.component';

describe('PayDetailComponent', () => {
  let component: PayDetailComponent;
  let fixture: ComponentFixture<PayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
