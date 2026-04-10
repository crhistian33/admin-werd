import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesActiveComponent } from './pages-active.component';

describe('PagesActiveComponent', () => {
  let component: PagesActiveComponent;
  let fixture: ComponentFixture<PagesActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
