import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponent } from './game-board.component';
import { QuadrantComponent } from '../quadrant/quadrant.component';
import { CellComponent } from '../cell/cell.component';
import { BoardHandlerService } from '../services/board-handler.service';

describe('GameBoardComponent', () => {
	let component: GameBoardComponent;
	let fixture: ComponentFixture<GameBoardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				GameBoardComponent,
				QuadrantComponent,
				CellComponent
			],
			providers: [
				BoardHandlerService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GameBoardComponent);
		component = fixture.componentInstance;
		component.board = {
            cellStates: [],
            inputPrimers: [],
            isSolved: false,
            level: 0,
            boardRegistryIndex: 0
        };
		component.reveal = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
