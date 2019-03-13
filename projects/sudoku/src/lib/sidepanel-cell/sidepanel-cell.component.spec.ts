import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidepanelCellComponent } from './sidepanel-cell.component';
import { BoardHandlerService } from '../services/board-handler.service';
import { Cell } from '../models/cell';

describe('SidepanelCellComponent', () => {
  let component: SidepanelCellComponent;
  let fixture: ComponentFixture<SidepanelCellComponent>;
	let boardHandlerService: BoardHandlerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidepanelCellComponent ],
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
		spyOn(boardHandlerService, 'getCell').and.returnValue(cell);
    fixture = TestBed.createComponent(SidepanelCellComponent);
    component = fixture.componentInstance;
		component.boardRegistryIndex = 0;
		component.level = 1;
		component.position = [0, 0, 0];
		component.reveal = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
