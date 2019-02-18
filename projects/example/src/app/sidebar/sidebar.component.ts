import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Board, BoardOverlordService } from 'sudoku';

import { getLevel } from '../utils/get-level';
import { getBoardRegistryIndex } from '../utils/get-board-registry-index';

@Component({
	selector: 'sudoku-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges, OnDestroy, OnInit {
	activeBoard: Board;
    @Input() activeBoardIndex: number;
    activeSidepanelIndex: number;
    board1: Board;
    board2: Board;
    board3: Board;
    boardRegistryIndex: number = 0;
    level: number = 0;
    @Input() levels: number;
	subscriptions: Subscription[] = [];

    constructor(private readonly boardOverlordService: BoardOverlordService) { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

    ngOnInit() {
        this.subscriptions.push(this.boardOverlordService.sidepanelBoards
            .subscribe(boards => {
                if (boards.length) {
                    this.board1 = boards[0];
                    this.board2 = boards[1];
                    this.board3 = boards[2];
                } else {
                    this.board3 = null;
                    this.board2 = null;
                    this.board1 = null;
                }
        }));
        this.subscriptions.push(this.boardOverlordService.activeSidepanelIndex.subscribe(index => {
            this.activeSidepanelIndex = index;
        }));
        this.boardOverlordService.onQuadrantHover(0, 0, 0);
    }

    ngOnChanges(e: SimpleChanges) {
        if (e.activeBoardIndex && !e.levels) {
            const index = e.activeBoardIndex.currentValue;
            if (index === -1) {
                this.activeBoard = this.boardOverlordService.getBoard(0, 0);
                this.level = 0;
                this.boardRegistryIndex = 0;
                this.boardOverlordService.onQuadrantHover(this.level, this.boardRegistryIndex, 0);
            } else {
                this.level = getLevel(index, this.levels);
                this.boardRegistryIndex = getBoardRegistryIndex(index, this.levels, this.boardOverlordService);
                this.activeBoard = this.boardOverlordService.getBoard(this.level, this.boardRegistryIndex);
                this.boardOverlordService.onQuadrantHover(this.level, this.boardRegistryIndex, 0);
            }
        }
    }
}
