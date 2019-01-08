import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SudokuComponent } from './sudoku.component';
import { BoardHandlerService } from './services/board-handler.service';
import { GameBoardComponent } from './game-board/game-board.component';
import { QuadrantComponent } from './quadrant/quadrant.component';
import { CellComponent } from './cell/cell.component';

describe('SudokuComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			declarations: [
				SudokuComponent,
				GameBoardComponent,
				QuadrantComponent,
				CellComponent
			],
			providers: [
				BoardHandlerService
			]
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(SudokuComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have as title 'sudoku'`, () => {
		const fixture = TestBed.createComponent(SudokuComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('sudoku');
	});
});