import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Cell } from '../models/cell';
import { BoardHandlerService } from '../services/board-handler.service';
import { BoardOverlordService } from '../services/board-overlord.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sudoku-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnDestroy, OnInit {
	activeControlMode: boolean;
	cell: Cell;
	gameOver: boolean;
    @Input() level: number;
    @Input() position: [number, number, number];
    @Input() boardRegistryIndex: number;
	@Input() reveal: boolean;
	subscriptions: Subscription[] = [];

	constructor(
        private readonly boardHandler: BoardHandlerService,
        private readonly boardOverlordService: BoardOverlordService) { }

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
		this.boardHandler.clickCell(this.position[0], this.position[1], this.level, this.boardRegistryIndex);
	}

    @HostListener('mouseover') onHover() {
        this.boardOverlordService.onCellHover(this.position[0], this.position[1], this.level, this.boardRegistryIndex);
    }

    @HostListener('mouseleave') onLeave() {
        this.boardOverlordService.onCellExit();
    }
}
