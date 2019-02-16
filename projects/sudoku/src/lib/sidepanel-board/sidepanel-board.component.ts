import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Board } from '../models/board';

@Component({
  selector: 'sudoku-sidepanel-board',
  templateUrl: './sidepanel-board.component.html',
  styleUrls: ['./sidepanel-board.component.scss']
})
export class SidepanelBoardComponent implements OnChanges {
	@Input() board: Board;
	isLoading: boolean = true;
	@Input() level: number;
	@Input() boardRegistryIndex: number;

	constructor() { }

	ngOnChanges(e: SimpleChanges) {
		if (e.board) {
			this.board = null;
			setTimeout(() => {
				this.board = e.board.currentValue;
                this.isLoading = false;
			}, 0);
		} else if (e.board && !e.board.currentValue) {
            this.isLoading = true;
        }
	}
}
