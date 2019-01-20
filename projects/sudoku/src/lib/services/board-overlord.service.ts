import { Injectable } from '@angular/core';
import { Board } from '../models/board';

const quadrantPositions: [number, number][][] = [
    [ [0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2] ],
    [ [0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5] ],
    [ [0, 6], [0, 7], [0, 8], [1, 6], [1, 7], [1, 8], [2, 6], [2, 7], [2, 8] ],
    [ [3, 0], [3, 1], [3, 2], [4, 0], [4, 1], [4, 2], [5, 0], [5, 1], [5, 2] ],
    [ [3, 3], [3, 4], [3, 5], [4, 3], [4, 4], [4, 5], [5, 3], [5, 4], [5, 5] ],
    [ [3, 6], [3, 7], [3, 8], [4, 6], [4, 7], [4, 8], [5, 6], [5, 7], [5, 8] ],
    [ [6, 0], [6, 1], [6, 2], [7, 0], [7, 1], [7, 2], [8, 0], [8, 1], [8, 2] ],
    [ [6, 3], [6, 4], [6, 5], [7, 3], [7, 4], [7, 5], [8, 3], [8, 4], [8, 5] ],
    [ [6, 6], [6, 7], [6, 8], [7, 6], [7, 7], [7, 8], [8, 6], [8, 7], [8, 8] ]
];

const primerPlacements: [number, number][] = [
	[1, 1], [1, 4], [1, 7],
	[4, 1], [4, 4], [4, 7],
	[7, 1], [7, 4], [7, 7],
];

@Injectable({
    providedIn: 'root'
})
export class BoardOverlordService {
    private boardsByLevel: Board[][] = [];

    constructor() { }

    boardUpdated(value: number, row: number, col: number, level: number, parentQuad: number, isComplete?: boolean) {
        console.log('BoardOverlordService', 'boardUpdated', level, parentQuad);
        this.setConnectedCells(value, row, col, level, parentQuad, true, isComplete);
        this.setConnectedCells(value, row, col, level, parentQuad, false, isComplete);

        const notSolved = this.boardsByLevel.some(lvl => {
            return lvl.some(b => !b.isSolved);
        });
        if (!notSolved) {
            console.log('BoardOverlordService', 'boardUpdated', 'Game Won!');
            return;
        }
    }

    registerBoard(board: Board) {
        if (!this.boardsByLevel[board.level]) {
            this.boardsByLevel[board.level] = [];
        }
        this.boardsByLevel[board.level][board.parentQuadrant] = board;
    }

    setConnectedCells(
        value: number,
        row: number,
        col: number,
        level: number,
        parentQuad: number,
        isUp: boolean,
        isComplete: boolean): boolean {
        // Reached the last level and beyond. Climb out of the rabbit hole.
        if (level <= -1 || level >= this.boardsByLevel.length) {
            return isComplete;
        }
        // Set the cell and lock it if necessary.
        console.log('setConnectedCells', level, parentQuad, this.boardsByLevel);
        const currentBoard = this.boardsByLevel[level][parentQuad];
        const currCell = currentBoard.cellStates[row][col];
        currCell.userAssignedValue = value;
        if (isComplete) {
            currCell.locked = true;
        } else {
            // Call to check for win state on this board.
            // If winstate --> isComplete = true.
            // If not --> isComplete = false;
            isComplete = true;
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (currentBoard.cellStates[r][c].userAssignedValue !== currentBoard.cellStates[r][c].value) {
                        isComplete = false;
                        break;
                    }
                }
                if (!isComplete) { break; }
            }
        }
        // Move onto the next level.
        if (isUp) {
            const primer = primerPlacements.findIndex(p => p[0] === row && p[1] === col);
            if (primer > -1) {
                const nextRowCell = quadrantPositions[parentQuad][primer];
                console.log('setConnectedCells', 'going up', nextRowCell, Math.floor(currentBoard.parentQuadrant / 9));
                return this.setConnectedCells(
                    value,
                    nextRowCell[0],
                    nextRowCell[1],
                    Number(level) - 1,
                    Math.floor(currentBoard.parentQuadrant / 9),
                    true,
                    isComplete);
            } // else simply falls off and therefore returns void as its cell isn't upwardly relevant.
        // isDown
        } else {
            const primerIndex = quadrantPositions[currCell.position[2]].findIndex(cell => (cell[0] === row && cell[1] === col));
            const nextRowCell = primerPlacements[primerIndex];
            console.log('setConnectedCells', 'going down', nextRowCell, (level * 9) + currCell.position[2]);
            return this.setConnectedCells(
                value,
                nextRowCell[0],
                nextRowCell[1],
                Number(level) + 1,
                (level * 9) + currCell.position[2],
                false,
                isComplete);
        }
    }
}
