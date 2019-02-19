import { Component, OnDestroy, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Board } from '../models/board';
import { BoardHandlerService } from '../services/board-handler.service';

@Component({
  selector: 'sudoku-sidepanel-board',
  templateUrl: './sidepanel-board.component.html',
  styleUrls: ['./sidepanel-board.component.scss'],
  providers: [BoardHandlerService]
})
export class SidepanelBoardComponent implements OnDestroy, OnChanges, OnInit {
    @Input() active: boolean;
	@Input() board: Board;
	@Input() boardRegistryIndex: number;
	gameOver: boolean;
	isLoading: boolean = true;
	@Input() level: number;
	subscriptions: Subscription[] = [];

	constructor(private readonly boardHandler: BoardHandlerService) { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

	ngOnInit() {
		this.subscriptions.push(this.boardHandler.gameOver.subscribe(go => {
            this.gameOver = go;
		}));
	}

	ngOnChanges(e: SimpleChanges) {
		if (e.board) {
			this.board = null;
			setTimeout(() => {
                this.boardHandler.assignBoard(e.board.currentValue);
                this.board = e.board.currentValue;
                this.isLoading = false;
			}, 0);
		} else if (e.board && !e.board.currentValue) {
            this.isLoading = true;
        }
	}
}
