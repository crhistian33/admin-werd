import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsTrashComponent } from './brands-trash.component';

describe('BrandsTrashComponent', () => {
  let component: BrandsTrashComponent;
  let fixture: ComponentFixture<BrandsTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsTrashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
