import { Component, OnChanges, Input, SimpleChanges, HostListener } from '@angular/core';
import { Board } from '../models/board';
import { BoardOverlordService } from '../services/board-overlord.service';

@Component({
	selector: 'sudoku-quadrant',
	templateUrl: './quadrant.component.html',
	styleUrls: ['./quadrant.component.scss']
})
export class QuadrantComponent implements OnChanges {
	@Input() quadrant: number;
	@Input() board: Board;
    @Input() level: number;
    @Input() boardRegistryIndex: number;
	@Input() reveal: boolean;

	showQuadrant: boolean = true;

	constructor(private readonly boardOverlordService: BoardOverlordService) { }

	ngOnChanges(e: SimpleChanges) {
		if (e.board) {
			this.showQuadrant = false;
			this.board = e.board.currentValue;
			setTimeout(() => { this.showQuadrant = true; }, 0);
		}
    }

	getCol(inner: number): number {
		return ((this.quadrant % 3) * 3) + inner;
	}

	getRow(outer: number): number {
		return ((Math.floor(this.quadrant / 3) * 3) + outer);
    }

    @HostListener('mouseover') onHover() {
        this.boardOverlordService.onQuadrantHover(this.level, this.boardRegistryIndex, this.quadrant);
    }
}
