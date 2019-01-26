import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Cell } from '../models/cell';
import { CellMaker } from '../utils/CellMaker';
import { Board } from '../models/board';
import { Row } from '../models/row';
import { BoardOverlordService } from './board-overlord.service';

const quadrantCenters = {
	0: [1, 1],
	1: [1, 4],
	2: [1, 7],
	3: [4, 1],
	4: [4, 4],
	5: [4, 7],
	6: [7, 1],
	7: [7, 4],
	8: [7, 7]
};

const quadLookup = {
	0: [0, 0, 0, 1, 1, 1, 2, 2, 2],
	1: [0, 0, 0, 1, 1, 1, 2, 2, 2],
	2: [0, 0, 0, 1, 1, 1, 2, 2, 2],
	3: [3, 3, 3, 4, 4, 4, 5, 5, 5],
	4: [3, 3, 3, 4, 4, 4, 5, 5, 5],
	5: [3, 3, 3, 4, 4, 4, 5, 5, 5],
	6: [6, 6, 6, 7, 7, 7, 8, 8, 8],
	7: [6, 6, 6, 7, 7, 7, 8, 8, 8],
	8: [6, 6, 6, 7, 7, 7, 8, 8, 8]
};

const placements: [number, number][] = [
	[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
	[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
	[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
	[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8],
	[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8],
	[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8],
	[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8],
	[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8],
	[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8],
];

const primerPlacements: [number, number][] = [
	[1, 1], [1, 4], [1, 7],
	[4, 1], [4, 4], [4, 7],
	[7, 1], [7, 4], [7, 7],
];

const opts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const clueCutoff = 71;
@Injectable()
export class BoardHandlerService {
	private activeControlDigitLocal: number = 0;
	private activeControlModeLocal: boolean = true;
	private board: Board;
    private clueCount: number = 81;
    private fillBail = false;
    private fillCounter = 0;
    private fillRowLast = 0;
    private gameOverLocal: boolean = false;
    private primers: Row;
	private shuffledPlacements: [number, number][];

	activeControlDigit: BehaviorSubject<number> = new BehaviorSubject<number>(this.activeControlDigitLocal);
	activeControlMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.activeControlModeLocal);
	gameOver: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.gameOverLocal);

	constructor(private readonly boardOverlordService: BoardOverlordService) { }

	activateDigitControl(num: number): void {
		this.activeControlDigitLocal = num;
		this.activeControlDigit.next(this.activeControlDigitLocal);
	}

	boardBuilder(primers: Row, level: number, boardRegistryIndex: number): Board {
        this.primers = primers || null;
		const start = new Date().getTime();
		this.gameOverLocal = false;
        this.gameOver.next(this.gameOverLocal);
        let successfulBuild = true;
        this.board = {
            cellStates: [],
            isSolved: false,
            level: level,
            boardRegistryIndex: boardRegistryIndex
        };
		// Retries if a generated board requires too many clues to be unique.
		do {
			this.board.cellStates = [ [], [].fill(null, 0, 9), [], [], [].fill(null, 0, 9), [], [], [].fill(null, 0, 9), [] ];
            if (this.primers) {
                primerPlacements.forEach((pl, index) => {
                    this.board.cellStates[pl[0]][pl[1]] = CellMaker(
                        this.primers[index].value, [pl[0], pl[1], index], [], true, this.primers[index].isClue);
                });
            }
			this.clueCount = 81;
            this.shuffledPlacements = this.shuffle(placements.slice());
            // console.log('Bad Board', 'Trying again?');
            this.fillCounter = 0;
            this.fillRowLast = 0;
            this.fillBail = false;
			successfulBuild = this.fillCell(0, 0);
		} while (!successfulBuild || !this.obscureCells());
		console.log(
			'BuildTime: ',
			Math.ceil((new Date().getTime() - start) / 1000),
			'Seconds, ',
			(81 - this.clueCount), 'Clues');
        this.boardOverlordService.registerBoard(this.board);
		return JSON.parse(JSON.stringify(this.board));
	}

	clickCell(row: number, col: number, level: number, registeredIndex: number): void {
		const cell = this.getCell(row, col);
		// Clues can't be changed, moveon.
		if (cell.isClue) {
			return;
		}
		// In permanent mode, user changes official digit and checks game state.
		if (this.activeControlModeLocal) {
			// Same digit erases cell, rather than needing eraser.
			// Otherwise use new digit / or erase if eraser.
			cell.userAssignedValue = (cell.userAssignedValue === this.activeControlDigitLocal) ?
				null : (this.activeControlDigitLocal || null);
			if (this.solveCheck(0)) {
				this.gameOverLocal = true;
				this.gameOver.next(this.gameOverLocal);
				console.log('Winner. Winner. Chicken Dinner!');
            }
            console.log('BoardHandlerService', 'clickCell', 'boardUpdated', level, registeredIndex);
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
    }

	fillCell(row: number, col: number): boolean {
		if (col >= 9) {
			row++;
			col = 0;
		}
        if (row >= 9) { return true; }
        // Max attempts to make this board attempt reached.
        // Go straight back to the beginning.
        // Do not pass Go. Do not collect another recursive loop.
        if (this.fillBail) { return false; }

        const neighbors = this.getNeighbors(row, col);
        const options = this.shuffle(opts.filter(y => !neighbors.includes(y)));
        // Chosen based off cells in upper level.
        const primer = this.board.cellStates[row][col];
        if (primer && primer.immutable) {
            // If the same row is checked in... a row, this is a bad board config.
            if (this.fillRowLast === row && this.fillCounter > 1000) {
                this.fillBail = true;
                return false;
            } else {
                this.fillRowLast = row;
                this.fillCounter++;
            }
            primer.neighbors = neighbors;
            return this.fillCell(row, col + 1);
        }

		let counter = 0;
		const cell: Cell = {
            clueByParent: false,
            flagValues: [],
            immutable: false,
			isClue: true,
			neighbors: neighbors,
			position: [row, col, quadLookup[row][col]],
			userAssignedValue: 0,
			value: 0
		};

		do {
			if (!options[counter] || counter >= 9) {
				this.board.cellStates[row][col] = null;
				return false;
			}
			cell.value = options[counter];
			cell.userAssignedValue = options[counter];
			this.board.cellStates[row][col] = cell;
            counter++;
		} while (!this.fillCell(row, col + 1));

		return true;
	}

	guessAtCell(index: number): boolean {
		if (index >= placements.length) {
			return true;
		}

		const place = placements[index];
		if (this.board.cellStates[place[0]][place[1]].isClue) {
			return this.guessAtCell(index + 1);
		}

		const neighbors = this.getNeighbors(place[0], place[1]);
		const options = this.shuffle(opts.filter(y => !neighbors.includes(y)));

		// If too many options exist for any given cell,
		// the permutations will be ridiculous.
		if (!options.length || options.length > 2) {
			return false;
		}

		let counter = 0;
		for (let i = 0; i < options.length; i++) {
			this.board.cellStates[place[0]][place[1]].userAssignedValue = options[i];
			if (this.guessAtCell(index + 1)) {
				counter++;
			}
			this.board.cellStates[place[0]][place[1]].userAssignedValue = 0;
			if (counter > 1) { break; }
		}

		if (counter !== 1) {
			return false;
		} else {
			return true;
		}
	}

	getCell(row: number, col: number): Cell {
		return this.board.cellStates[row][col];
	}

	getNeighbors(row: number, col: number, skipQuad?: boolean): number[] {
		const neighbors = [
			...this.board.cellStates[row].slice(0, col).filter(c => c && c.userAssignedValue).map(c => c.userAssignedValue),
			...this.board.cellStates[row].slice(col + 1, 9).filter(c => c && c.userAssignedValue).map(c => c.userAssignedValue)
		];
		for (let i = 0; i < 9; i++) {
			if (i === row || !(this.board.cellStates[i][col] && this.board.cellStates[i][col].userAssignedValue)) { continue; }
			neighbors.push(this.board.cellStates[i][col].userAssignedValue);
		}

		if (!skipQuad) {
			const quadCenter = quadrantCenters[quadLookup[row][col]];
			for (let j = -1; j < 2; j++) {
				for (let k = -1; k < 2; k++) {
					const cell = this.board.cellStates[quadCenter[0] + j][quadCenter[1] + k];
					const val = cell && cell.userAssignedValue;
					if (val) { neighbors.push(val); }
				}
			}
		}
		return neighbors;
	}

	obscureCells(): boolean {
		for (let i = 0; i < this.shuffledPlacements.length; i++) {
            const place = this.shuffledPlacements[i];
            const currCell = this.board.cellStates[place[0]][place[1]];

			currCell.isClue = false;
			currCell.userAssignedValue = 0;
			// Has to be a clue to make a unique solution
			if (currCell.clueByParent || !this.guessAtCell(0)) {
                currCell.isClue = true;
				currCell.userAssignedValue = currCell.value;
				this.clueCount--;
            }
            // The parent chose to hide this connected cell.
            // If this board can't support this iteration without making it a clue, start again.
            if (currCell.isClue && currCell.hiddenByParent) {
                return false;
            }
			// Cutoff if too many clues needed before cutoff
			// (Board too complex. Make new one.)
			if (this.clueCount <= 66) {
                return false;
            }
            if (i >= clueCutoff && this.shuffledPlacements.slice(i).some(p => this.board.cellStates[p[0]][p[1]].hiddenByParent)) {
                return false;
            }
			// The last cutoff amount (71 last checked) is good enough. Rest can be clues.
			if (i >= clueCutoff) {
				this.clueCount -= (81 - clueCutoff - 1);
				return true;
			}
		}
	}

	shuffle(input: number[]): number[];
	shuffle(input: [number, number][]): [number, number][];
	shuffle(input) {
		for (let i = input.length - 1; i >= 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			const itemAtIndex = input[randomIndex];

			input[randomIndex] = input[i];
			input[i] = itemAtIndex;
		}
		return input;
	}

	solveCheck(index: number) {
		if (index >= placements.length) {
			return true;
		}
		const place = placements[index];
		if (this.board.cellStates[place[0]][place[1]].isClue) {
			return this.solveCheck(index + 1);
		}
		const neighbors = this.getNeighbors(place[0], place[1], true);
		const choice = this.board.cellStates[place[0]][place[1]].userAssignedValue;
		if (!choice) {
			return false;
		}
		if (neighbors.includes(choice)) {
			return false;
		}
		return this.solveCheck(index + 1);
	}

	stringify(b: Board): string {
		let map = '';
		b.cellStates.forEach(row => {
			map += row.map(c => c.userAssignedValue + '').reduce((str, val) => {
				return str += val;
			});
		});
		return map;
	}

	toggleControls(isPerm: boolean): void {
		this.activeControlModeLocal = isPerm;
		this.activeControlMode.next(this.activeControlModeLocal);
	}
}
