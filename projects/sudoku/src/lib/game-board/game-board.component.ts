import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Board } from '../models/board';

@Component({
	selector: 'sudoku-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnChanges {
	@Input() board: Board;
	@Input() reveal: boolean;

	constructor() { }

	ngOnChanges(e: SimpleChanges) {
		if (e.board) {
			this.board = [];
			setTimeout(() => { this.board = e.board.currentValue; }, 0);
		}
	}
}
