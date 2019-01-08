import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Cell } from '../models/cell';
import { BoardHandlerService } from '../services/board-handler.service';
import { Subscription } from 'rxjs';

let index = 0;

@Component({
	selector: 'sudoku-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnDestroy, OnInit {
	activeControlMode: boolean;
	cell: Cell;
	gameOver: boolean;
	@Input() position: [number, number, number];
	@Input() reveal: boolean;
	subscriptions: Subscription[] = [];

	constructor(private readonly boardHandler: BoardHandlerService) { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

	ngOnInit() {
		this.cell = this.boardHandler.getCell(this.position[0], this.position[1]);
		this.subscriptions.push(this.boardHandler.gameOver.subscribe(go => {
			this.gameOver = go;
		}));
		this.subscriptions.push(this.boardHandler.activeControlMode.subscribe(isPerm => {
			this.activeControlMode = isPerm;
		}));
	}

	cellClicked() {
		this.boardHandler.clickCell(this.position[0], this.position[1]);
	}
}