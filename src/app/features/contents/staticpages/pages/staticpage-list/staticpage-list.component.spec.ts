import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticpageListComponent } from './staticpage-list.component';

describe('StaticpageListComponent', () => {
  let component: StaticpageListComponent;
  let fixture: ComponentFixture<StaticpageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticpageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticpageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
