import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SudokuRoutingModule } from './sudoku-routing.module';
import { SudokuComponent } from './sudoku.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CellComponent } from './cell/cell.component';
import { QuadrantComponent } from './quadrant/quadrant.component';
import { SidepanelBoardComponent } from './sidepanel-board/sidepanel-board.component';
import { SidepanelQuadrantComponent } from './sidepanel-quadrant/sidepanel-quadrant.component';
import { SidepanelCellComponent } from './sidepanel-cell/sidepanel-cell.component';

@NgModule({
	declarations: [
		SudokuComponent,
		CellComponent,
		QuadrantComponent,
		GameBoardComponent,
		SidepanelBoardComponent,
		SidepanelQuadrantComponent,
		SidepanelCellComponent
	],
	imports:  [CommonModule, SudokuRoutingModule ],
	exports: [ SudokuComponent, SidepanelBoardComponent ]
})
export class SudokuModule {}
