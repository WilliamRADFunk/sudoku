import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Cell } from '../models/cell';
import { Subscription } from 'rxjs';
import { CellMaker } from '../utils/CellMaker';

@Component({
  selector: 'sudoku-sidepanel-cell',
  templateUrl: './sidepanel-cell.component.html',
  styleUrls: ['./sidepanel-cell.component.scss']
})
export class SidepanelCellComponent implements OnDestroy, OnInit {
	activeControlMode: boolean;
	cell: Cell = CellMaker(3, [0, 0, 0], false, false);
	gameOver: boolean;
    @Input() level: number;
    @Input() position: [number, number, number];
    @Input() boardRegistryIndex: number;
	@Input() reveal: boolean;
    subscriptions: Subscription[] = [];

    constructor() { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

    ngOnInit() {
    }
}
