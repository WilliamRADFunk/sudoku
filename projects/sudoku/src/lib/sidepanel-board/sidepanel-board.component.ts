import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { Board } from '../models/board';
import { BoardHandlerService } from '../services/board-handler.service';

@Component({
  selector: 'sudoku-sidepanel-board',
  templateUrl: './sidepanel-board.component.html',
  styleUrls: ['./sidepanel-board.component.scss'],
  providers: [BoardHandlerService]
})
export class SidepanelBoardComponent implements OnChanges {
    @Input() active: boolean;
	@Input() board: Board;
	isLoading: boolean = true;
	@Input() level: number;
	@Input() boardRegistryIndex: number;

	constructor(private readonly boardHandlerService: BoardHandlerService) { }

	ngOnChanges(e: SimpleChanges) {
		if (e.board) {
			this.board = null;
			setTimeout(() => {
                this.boardHandlerService.assignBoard(e.board.currentValue);
                this.board = e.board.currentValue;
                this.isLoading = false;
			}, 0);
		} else if (e.board && !e.board.currentValue) {
            this.isLoading = true;
        }
	}
}
