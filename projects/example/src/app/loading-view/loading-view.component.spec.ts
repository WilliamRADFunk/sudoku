import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingViewComponent } from './loading-view.component';

describe('LoadingViewComponent', () => {
  let component: LoadingViewComponent;
  let fixture: ComponentFixture<LoadingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
