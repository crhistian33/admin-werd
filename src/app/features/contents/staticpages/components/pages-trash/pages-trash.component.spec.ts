import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesTrashComponent } from './pages-trash.component';

describe('PagesTrashComponent', () => {
  let component: PagesTrashComponent;
  let fixture: ComponentFixture<PagesTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesTrashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
