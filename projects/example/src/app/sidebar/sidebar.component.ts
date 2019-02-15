import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Board, BoardOverlordService } from 'sudoku';
import { getLevel } from '../utils/get-level';
import { getBoardRegistryIndex } from '../utils/get-board-registry-index';

@Component({
	selector: 'sudoku-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges {
	activeBoard: Board;
    @Input() activeBoardIndex: number;
    boardRegistryIndex: number;
    level: number;
    @Input() levels: number;

	constructor(private readonly boardOverlordService: BoardOverlordService) { }

    ngOnChanges(e: SimpleChanges) {
        if (e.activeBoardIndex && !e.levels) {
            const index = e.activeBoardIndex.currentValue;
            if (index === -1) {
                this.activeBoard = this.boardOverlordService.getBoard(0, 0);
            } else {
                this.activeBoard = this.boardOverlordService.getBoard(
                    getLevel(index),
                    getBoardRegistryIndex(index, this.boardOverlordService));
            }
        }
    }

}
