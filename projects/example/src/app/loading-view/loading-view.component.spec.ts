import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SudokuModule } from 'sudoku';

import { LoadingViewComponent } from './loading-view.component';
import { LoadTrackerService } from '../services/load-tracker.service';

describe('LoadingViewComponent', () => {
  let component: LoadingViewComponent;
  let fixture: ComponentFixture<LoadingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            NgbModule,
            SudokuModule
        ],
        declarations: [
            LoadingViewComponent
        ],
        providers: [
            LoadTrackerService
        ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingViewComponent);
    component = fixture.componentInstance;
    component.loadedAmount = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
