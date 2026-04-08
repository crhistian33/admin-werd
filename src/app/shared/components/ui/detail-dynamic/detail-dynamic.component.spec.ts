import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDynamicComponent } from './detail-dynamic.component';

describe('DetailDynamicComponent', () => {
  let component: DetailDynamicComponent;
  let fixture: ComponentFixture<DetailDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDynamicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
