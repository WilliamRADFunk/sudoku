import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { BoardHandlerService } from '../services/board-handler.service';
import { Cell } from '../models/cell';

@Component({
	selector: 'sudoku-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnChanges {
	@Input() board: Cell[][];
	@Input() reveal: boolean;

	constructor() { }

	ngOnChanges(e: SimpleChanges) {
		if (e.board) {
			this.board = [];
			setTimeout(() => { this.board = e.board.currentValue; }, 0);
		}
	}
}