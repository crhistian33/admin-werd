import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsActiveComponent } from './brands-active.component';

describe('BrandsActiveComponent', () => {
  let component: BrandsActiveComponent;
  let fixture: ComponentFixture<BrandsActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
