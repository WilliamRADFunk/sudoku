import { Component, OnChanges, OnDestroy, OnInit, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { BoardHandlerService } from './services/board-handler.service';
import { Board } from './models/board';

@Component({
	selector: 'su-do-ku',
	templateUrl: './sudoku.component.html',
    styleUrls: ['./sudoku.component.scss'],
    providers: [ BoardHandlerService ]
})
export class SudokuComponent implements OnChanges, OnDestroy, OnInit {
	activeControl: number = 0;
	activeControlMode: boolean = true;
    @Input() board: Board;
    @Input() isDev?: boolean = false;
    @Input() level: number;
    @Input() boardRegistryIndex: number;
	reveal: boolean = false;
	subscriptions: Subscription[] = [];
	title: string = 'sudoku';

	constructor(private readonly boardHandlerService: BoardHandlerService) { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

	ngOnInit(): void {
		this.subscriptions.push(this.boardHandlerService.activeControlDigit.subscribe(num => {
			this.activeControl = num;
		}));
		this.subscriptions.push(this.boardHandlerService.activeControlMode.subscribe(isPerm => {
			this.activeControlMode = isPerm;
		}));
    }

    ngOnChanges(e: SimpleChanges) {
        if (e.board) {
			this.board = null;
			console.log('board', e.board);
			setTimeout(() => {
                this.boardHandlerService.assignBoard(e.board.currentValue);
                this.board = e.board.currentValue;
            }, 0);
        }
    }

	pressedDigitControl(num: number): void {
		this.boardHandlerService.activateDigitControl(num);
	}

	toggleControls(): void {
		this.activeControlMode = !this.activeControlMode;
		this.boardHandlerService.toggleControls(this.activeControlMode);
	}

	toggleReveal(): void {
		this.reveal = !this.reveal;
	}
}
