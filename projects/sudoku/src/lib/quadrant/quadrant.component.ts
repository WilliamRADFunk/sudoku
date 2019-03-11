import { Component, OnChanges, OnDestroy, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { Board } from '../models/board';
import { BoardOverlordService } from '../services/board-overlord.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sudoku-quadrant',
	templateUrl: './quadrant.component.html',
	styleUrls: ['./quadrant.component.scss']
})
export class QuadrantComponent implements OnChanges, OnDestroy, OnInit {
	private activeQuadrant: number = -1;
	@Input() quadrant: number;
	@Input() board: Board;
    @Input() level: number;
    @Input() boardRegistryIndex: number;
	@Input() reveal: boolean;
	private readonly subs: Subscription[] = [];

	showQuadrant: boolean = true;

	constructor(private readonly boardOverlordService: BoardOverlordService) { }

	ngOnDestroy() {
		this.subs.forEach(s => s && s.unsubscribe());
		this.subs.length = 0;
	}

	ngOnInit() {
		this.subs.push(this.boardOverlordService.activeQuadrant.subscribe(index => {
			this.activeQuadrant = index;
		}));
	}

	ngOnChanges(e: SimpleChanges) {
		if (e.board) {
			this.showQuadrant = false;
			this.board = e.board.currentValue;
			setTimeout(() => { this.showQuadrant = true; }, 0);
		}
	}
	
	getActiveColumnStyles() {
		const quadrantStyles = {
			'bottom-quadrant': false,
			'middle-quadrant': false,
			'top-quadrant': false
		};
		const quadCol = this.quadrant % 3;
		const quadRow = Math.floor(this.quadrant / 3);
		if ((this.activeQuadrant % 3) !== quadCol) {
			return quadrantStyles;
		} else if (!quadRow) {
			quadrantStyles['top-quadrant'] = true;
		} else if (quadRow === 1) {
			quadrantStyles['middle-quadrant'] = true;
		} else {
			quadrantStyles['bottom-quadrant'] = true;
		}
		return quadrantStyles;
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
