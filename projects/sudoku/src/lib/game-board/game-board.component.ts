import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Board } from '../models/board';

@Component({
	selector: 'sudoku-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnChanges {
    @Input() board: Board;
    isLoading: boolean = true;
    @Input() level: number;
    @Input() parentQuadrant: number;
	@Input() reveal: boolean;

	constructor() { }

	ngOnChanges(e: SimpleChanges) {
		if (e.board && e.board.currentValue) {
			this.board.cellStates = [];
			setTimeout(() => {
                this.board = e.board.currentValue;
                this.isLoading = false;
            }, 0);
		}
	}
}
