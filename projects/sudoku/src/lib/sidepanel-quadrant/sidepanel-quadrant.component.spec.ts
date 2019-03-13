import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidepanelQuadrantComponent } from './sidepanel-quadrant.component';
import { BoardHandlerService } from '../services/board-handler.service';
import { SidepanelCellComponent } from '../sidepanel-cell/sidepanel-cell.component';
import { Cell } from '../models/cell';

describe('SidepanelQuadrantComponent', () => {
  let component: SidepanelQuadrantComponent;
  let fixture: ComponentFixture<SidepanelQuadrantComponent>;
	let boardHandlerService: BoardHandlerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidepanelQuadrantComponent,
				SidepanelCellComponent
      ],
			providers: [
				BoardHandlerService
			]
    })
    .compileComponents();
		boardHandlerService = TestBed.get(BoardHandlerService);
  }));

  beforeEach(() => {
		const cell: Cell = {
      flagValues: [],
      immutable: false,
			isClue: false,
			position: [0, 0, 0],
			userAssignedValue: null,
			value: null
    };
    let singleArray = [];
    singleArray.length = 9;
    singleArray = singleArray.fill(cell);
    let doubleArray = [];
    doubleArray.length = 9;
    doubleArray = doubleArray.fill(singleArray);
    fixture = TestBed.createComponent(SidepanelQuadrantComponent);
    component = fixture.componentInstance;
    component.quadrant = 0;
    component.board = {
        boardRegistryIndex: 0,
        cellStates: doubleArray,
        inputPrimers: [],
        isSolved: false,
        level: 1
    };
    component.level = 1;
    component.boardRegistryIndex = 0;
    component.reveal = false;
    boardHandlerService.assignBoard(component.board);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
