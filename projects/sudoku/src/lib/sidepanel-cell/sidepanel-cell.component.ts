import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Cell } from '../models/cell';
import { BoardHandlerService } from '../services/board-handler.service';

@Component({
  selector: 'sudoku-sidepanel-cell',
  templateUrl: './sidepanel-cell.component.html',
  styleUrls: ['./sidepanel-cell.component.scss']
})
export class SidepanelCellComponent implements OnDestroy, OnInit {
	activeControlMode: boolean;
	cell: Cell;
	gameOver: boolean;
    @Input() level: number;
    @Input() position: [number, number, number];
    @Input() boardRegistryIndex: number;
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
}
