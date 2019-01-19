import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardHandlerService } from './services/board-handler.service';
import { Cell } from './models/cell';
import { Subscription } from 'rxjs';
import { Board } from './models/board';
import { Row } from './models/row';

@Component({
	selector: 'su-do-ku',
	templateUrl: './sudoku.component.html',
    styleUrls: ['./sudoku.component.scss'],
    providers: [ BoardHandlerService ]
})
export class SudokuComponent implements OnDestroy, OnInit {
	activeControl: number = 0;
	activeControlMode: boolean = true;
    board: Board;
    @Output() boardUpdate: EventEmitter<Board> = new EventEmitter<Board>();
    @Input() inputPrimers?: Row;
    @Input() isDev?: boolean;
    @Input() isSolo?: boolean;
	reveal: boolean = false;
	subscriptions: Subscription[] = [];
	title: string = 'sudoku';

	constructor(private readonly boardHandlerService: BoardHandlerService) { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

	ngOnInit(): void {
        this.board = this.boardHandlerService.boardBuilder(this.isSolo ? null : this.inputPrimers);
        this.boardUpdate.emit(JSON.parse(JSON.stringify(this.board)));
		this.subscriptions.push(this.boardHandlerService.activeControlDigit.subscribe(num => {
			this.activeControl = num;
		}));
		this.subscriptions.push(this.boardHandlerService.activeControlMode.subscribe(isPerm => {
			this.activeControlMode = isPerm;
		}));
	}

	pressedDigitControl(num: number): void {
		this.boardHandlerService.activateDigitControl(num);
	}

	rebuildBoard(): void {
		this.board = [];
		setTimeout(() => { this.board = this.boardHandlerService.boardBuilder(); }, 250);
	}

	toggleControls(): void {
		this.activeControlMode = !this.activeControlMode;
		this.boardHandlerService.toggleControls(this.activeControlMode);
	}

	toggleReveal(): void {
		this.reveal = !this.reveal;
	}
}
