import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SudokuRoutingModule } from './sudoku-routing.module';
import { SudokuComponent } from './sudoku.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CellComponent } from './cell/cell.component';
import { QuadrantComponent } from './quadrant/quadrant.component';

@NgModule({
	declarations: [
		SudokuComponent,
		CellComponent,
		QuadrantComponent,
		GameBoardComponent
	],
	imports:  [CommonModule, SudokuRoutingModule ],
	exports: [ SudokuComponent ]
})
export class SudokuModule {}
