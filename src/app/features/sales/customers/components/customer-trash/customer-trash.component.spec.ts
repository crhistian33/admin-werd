import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrashComponent } from './customer-trash.component';

describe('CustomerTrashComponent', () => {
  let component: CustomerTrashComponent;
  let fixture: ComponentFixture<CustomerTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTrashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
