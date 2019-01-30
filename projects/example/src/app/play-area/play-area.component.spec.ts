import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAreaComponent } from './play-area.component';
import { LoadTrackerService } from '../services/load-tracker.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SudokuModule } from 'sudoku';

describe('PlayAreaComponent', () => {
  let component: PlayAreaComponent;
  let fixture: ComponentFixture<PlayAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        SudokuModule
      ],
      declarations: [
        PlayAreaComponent
      ],
      providers: [ LoadTrackerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayAreaComponent);
    component = fixture.componentInstance;
    component.levels = 1;
    component.activeBoardIndex = -1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
