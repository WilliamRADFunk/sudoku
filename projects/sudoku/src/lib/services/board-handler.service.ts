import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Cell } from '../models/cell';
import { Board } from '../models/board';
import { BoardOverlordService } from './board-overlord.service';
import { solveCheck } from '../utils/BoardBuilder';

@Injectable()
export class BoardHandlerService {
	private activeControlDigitLocal: number = 0;
	private activeControlModeLocal: boolean = true;
	private board: Board;
    private gameOverLocal: boolean = false;

	activeControlDigit: BehaviorSubject<number> = new BehaviorSubject<number>(this.activeControlDigitLocal);
	activeControlMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.activeControlModeLocal);
	gameOver: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.gameOverLocal);

	constructor(private readonly boardOverlordService: BoardOverlordService) { }

	activateDigitControl(num: number): void {
		this.activeControlDigitLocal = num;
		this.activeControlDigit.next(this.activeControlDigitLocal);
    }

    assignBoard(board: Board): void {
        this.gameOverLocal = false;
        this.gameOver.next(this.gameOverLocal);
        this.board = board;
        if (solveCheck(0, board)) {
            this.gameOverLocal = true;
            this.gameOver.next(this.gameOverLocal);
            this.boardOverlordService.boardCheckupFull();
        }
    }

	clickCell(row: number, col: number, level: number, registeredIndex: number): void {
		const cell = this.getCell(row, col);
		// Clues can't be changed, moveon.
		if (cell.isClue || cell.locked) {
			return;
		}
		// In permanent mode, user changes official digit and checks game state.
		if (this.activeControlModeLocal) {
			// Same digit erases cell, rather than needing eraser.
			// Otherwise use new digit / or erase if eraser.
			cell.userAssignedValue = (cell.userAssignedValue === this.activeControlDigitLocal) ?
				null : (this.activeControlDigitLocal || null);
			if (solveCheck(0, this.board)) {
				this.gameOverLocal = true;
				this.gameOver.next(this.gameOverLocal);
				// console.log('Board Complete!');
            }
            this.boardOverlordService.boardUpdated(cell.userAssignedValue, row, col, level, registeredIndex);
			return;
		}
		// In flag mode, user adds or removes "potential" digits from view.
		const filterFlags = cell.flagValues.filter(fVal => fVal !== this.activeControlDigitLocal);
		if (filterFlags.length === cell.flagValues.length) {
			this.activeControlDigitLocal ? cell.flagValues.push(this.activeControlDigitLocal) : cell.flagValues = [];
			cell.flagValues.sort();
			return;
		}
        cell.flagValues = filterFlags;
        this.boardOverlordService.flagsUpdated(filterFlags, row, col, level, registeredIndex);
    }

	getCell(row: number, col: number): Cell {
		return this.board.cellStates[row][col];
	}

	toggleControls(isPerm: boolean): void {
		this.activeControlModeLocal = isPerm;
		this.activeControlMode.next(this.activeControlModeLocal);
	}
}
