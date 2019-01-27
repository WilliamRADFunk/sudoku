import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingViewComponent } from './loading-view.component';
import { LoadTrackerService } from '../services/load-tracker.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('LoadingViewComponent', () => {
  let component: LoadingViewComponent;
  let fixture: ComponentFixture<LoadingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgbModule ],
      declarations: [ LoadingViewComponent ],
      providers: [ LoadTrackerService ]
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
