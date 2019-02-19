import { Component, OnDestroy, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Board } from '../models/board';
import { BoardHandlerService } from '../services/board-handler.service';

@Component({
	selector: 'sudoku-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnDestroy, OnChanges, OnInit {
    @Input() board: Board;
	gameOver: boolean;
    isLoading: boolean = true;
    @Input() level: number;
    @Input() boardRegistryIndex: number;
	@Input() reveal: boolean;
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
		if (e.board && e.board.currentValue) {
			setTimeout(() => {
                this.board = e.board.currentValue;
                this.isLoading = false;
            }, 0);
		} else if (e.board && !e.board.currentValue) {
            this.isLoading = true;
        }
	}
}
