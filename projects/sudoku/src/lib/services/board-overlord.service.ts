import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BigNumber } from 'bignumber.js';

import { Board } from '../models/board';
import { Cell } from '../models/cell';

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
    private activeCell: Cell;
    private boardsByLevel: Board[][] = [];
    private boardBuildTimes: number[] = Array(20).fill(0);
    private loadKey: string = '';
    private oldWinBoards: [number, number][] = [];
    private newWinBoards: [number, number][] = [];
    activeQuadrant: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
    activeSidepanelIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    gameOver: Subject<boolean> = new Subject<boolean>();
    numCompletedBoards: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    sidepanelBoards: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);

    constructor() { }

    boardCheckupFull() {
        if (this.checkAllBoardsForCompletion()) {
            this.newWinBoards.forEach(brd => {
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        this.lockWinCells(r, c, brd[0], brd[1], true);
                        this.lockWinCells(r, c, brd[0], brd[1], false);
                    }
                }
            });
            this.oldWinBoards.push(...this.newWinBoards);
            this.newWinBoards = [];
        }

        this.numCompletedBoards.next(this.oldWinBoards.length);

        const notSolved = this.boardsByLevel.some(lvl => {
            return lvl.some(b => !b.isSolved);
        });
        if (!notSolved) {
            console.log('Game Won! Winner Winner Chicken Dinner!');
            this.gameOver.next(true);
        }
    }

    boardUpdated(value: number, row: number, col: number, level: number, registeredIndex: number): void {
        this.setConnectedCells(value, row, col, level, registeredIndex, true);
        this.setConnectedCells(value, row, col, level, registeredIndex, false);

        this.boardCheckupFull();
    }

    checkForCompletion(board: Board): boolean {
        // Call to check for win state on this board.
        // If winstate --> isComplete = true.
        // If not --> isComplete = false;
        let isComplete = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board.cellStates[r][c].userAssignedValue !== board.cellStates[r][c].value) {
                    isComplete = false;
                    break;
                }
            }
            if (!isComplete) { break; }
        }
        if (isComplete) {
            board.isSolved = true;
        }
        return isComplete;
    }

    checkAllBoardsForCompletion(): boolean {
        let count = false;
        for (let i = 0; i < this.boardsByLevel.length; i++) {
            for (let j = 0; j < this.boardsByLevel[i].length; j++) {
                if (!this.oldWinBoards.some(brd => (brd[0] === i && brd[1] === j)) && this.checkForCompletion(this.boardsByLevel[i][j])) {
                    this.newWinBoards.push([i, j]);
                    count = true;
                }
            }
        }
        return count;
    }

    flagsUpdated(flags: number[], row: number, col: number, level: number, registeredIndex: number): void {
        const currentBoard = this.boardsByLevel[level][registeredIndex];
        const currCell = currentBoard.cellStates[row][col];
        currCell.flagValues = flags;
    }

    flushBoards() {
        this.gameOver.next(false);
        this.activeCell = null;
        this.activeQuadrant.next(-1);
        this.boardsByLevel = [];
        this.boardBuildTimes = Array(20).fill(0);
        this.oldWinBoards = [];
        this.newWinBoards = [];
        this.numCompletedBoards.next(0);
        this.activeSidepanelIndex.next(0);
        this.sidepanelBoards.next([]);
        this.loadKey = '';
    }

    getBoard(indexLevel: number, registeredIndex: number): Board {
        return JSON.parse(JSON.stringify(this.boardsByLevel[indexLevel][registeredIndex]));
    }

    getBoardBuildTimes(): number[] {
        return this.boardBuildTimes.slice();
    }

    getLevelLength(level: number): number {
        return this.boardsByLevel[level].length;
    }

    getLoadGameKey() {
        return this.loadKey;
    }

    getSaveGameKey() {
        let key = '';
        key += this.boardsByLevel.length;
        for (let i = 0; i < this.boardsByLevel.length; i++) {
            for (let j = 0; j < this.boardsByLevel[i].length; j++) {
                let boardString = '';
                for (let k = 0; k < this.boardsByLevel[i][j].cellStates.length; k++) {
                    for (let m = 0; m < this.boardsByLevel[i][j].cellStates[k].length; m++) {
                        const cell = this.boardsByLevel[i][j].cellStates[k][m];
                        boardString += cell.clueByParent ? '1' : '0';
                        [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ].forEach(flag => {
                            boardString += cell.flagValues.includes(flag) ? flag : 0;
                        });
                        boardString += cell.hiddenByParent ? '1' : '0';
                        boardString += cell.immutable ? '1' : '0';
                        boardString += cell.isClue ? '1' : '0';
                        boardString += cell.locked ? '1' : '0';
                        cell.position.forEach(pos => {
                            boardString += pos;
                        });
                        boardString += cell.userAssignedValue || '0';
                        boardString += cell.value || '0';
                    }
                }
                key += 'Z' + boardString;
            }
        }
        return key;
    }

    lockWinCells(row: number, col: number, level: number, registeredIndex: number, isUp: boolean) {
        // Reached the last level and beyond. Climb out of the rabbit hole.
        if (level <= -1 || level >= this.boardsByLevel.length) {
            return;
        }
        // Set the cell and lock it if necessary.
        const currentBoard = this.boardsByLevel[level][registeredIndex];
        const currCell = currentBoard.cellStates[row][col];
        currCell.locked = true;

        // Move onto the next level.
        if (isUp) {
            const primer = primerPlacements.findIndex(p => p[0] === row && p[1] === col);
            if (primer > -1) {
                const nextRowCell = quadrantPositions[registeredIndex][primer];
                this.lockWinCells(
                    nextRowCell[0],
                    nextRowCell[1],
                    Number(level) - 1,
                    Math.floor(registeredIndex / 9),
                    true);
            } // else simply falls off and therefore returns void as its cell isn't upwardly relevant.
        // isDown
        } else {
            const primerIndex = quadrantPositions[currCell.position[2]].findIndex(cell => (cell[0] === row && cell[1] === col));
            const nextRowCell = primerPlacements[primerIndex];
            this.lockWinCells(
                nextRowCell[0],
                nextRowCell[1],
                Number(level) + 1,
                (registeredIndex * 9) + currCell.position[2],
                false);
        }
    }

    onCellExit() {
        if (this.activeCell) {
            this.activeCell.active = false;
            this.activeCell = null;
        }
    }

    onCellHover(row: number, col: number, level: number, boardRegistryIndex: number) {
        // Only if there is a lower level. Otherwise bail out.
        const lowerLevel = Number(level) + 1;
        if (lowerLevel >= this.boardsByLevel.length) {
            return;
        }

        const currentBoard = this.boardsByLevel[level][boardRegistryIndex];
        const currCell = currentBoard.cellStates[row][col];
        const primerIndex = quadrantPositions[currCell.position[2]].findIndex(cell => (cell[0] === row && cell[1] === col));
        const nextRowCell = primerPlacements[primerIndex];

        const lowerBoard = this.boardsByLevel[lowerLevel][(boardRegistryIndex * 9) + currCell.position[2]];
        const lowerCell = lowerBoard.cellStates[nextRowCell[0]][nextRowCell[1]];

        if (this.activeCell) {
            this.activeCell.active = false;
            this.activeCell = null;
        }

        this.activeCell = lowerCell;
        this.activeCell.active = true;
    }

    onQuadrantHover(level: number, boardRegistryIndex: number, quadrant: number) {
        const localLevel = Number(level) + 1;
        if (!this.boardsByLevel[localLevel]) {
            this.sidepanelBoards.next([]);
            this.activeQuadrant.next(-1);
            return;
        }
        let boards = [];
        if (quadrant % 3 === 0) {
            boards = [
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9)],
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 3],
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 6]
            ];
        } else if (quadrant % 3 === 1) {
            boards = [
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 1],
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 4],
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 7]
            ];
        } else {
            boards = [
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 2],
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 5],
                this.boardsByLevel[localLevel][(boardRegistryIndex * 9) + 8]
            ];
        }
        this.sidepanelBoards.next(boards);
        this.activeQuadrant.next(quadrant);
        this.activeSidepanelIndex.next(Math.floor(quadrant / 3));
    }

    registerBoard(board: Board): void {
        if (!this.boardsByLevel[board.level]) {
            this.boardsByLevel[board.level] = [];
        }
        this.boardsByLevel[board.level][board.boardRegistryIndex] = board;
        // console.log(
        //     'registerBoard',
        //     this.boardsByLevel[0].length,
        //     this.boardsByLevel[1] && this.boardsByLevel[1].length,
        //     this.boardsByLevel[2] && this.boardsByLevel[2].length,
        //     this.boardsByLevel[3] && this.boardsByLevel[3].length,
        //     this.boardsByLevel[4] && this.boardsByLevel[4].length);
    }

    setConnectedCells(value: number, row: number, col: number, level: number, registeredIndex: number, isUp: boolean): void {
        // Reached the last level and beyond. Climb out of the rabbit hole.
        if (level <= -1 || level >= this.boardsByLevel.length) {
            return;
        }
        // Set the cell and lock it if necessary.
        const currentBoard = this.boardsByLevel[level][registeredIndex];
        const currCell = currentBoard.cellStates[row][col];
        currCell.userAssignedValue = value;
        // Move onto the next level.
        if (isUp) {
            const primer = primerPlacements.findIndex(p => p[0] === row && p[1] === col);
            if (primer > -1) {
                const nextRowCell = quadrantPositions[registeredIndex % 9][primer];
                this.setConnectedCells(
                    value,
                    nextRowCell[0],
                    nextRowCell[1],
                    Number(level) - 1,
                    Math.floor(registeredIndex / 9),
                    true);
            } // else simply falls off and therefore returns void as its cell isn't upwardly relevant.
        // isDown
        } else {
            const primerIndex = quadrantPositions[currCell.position[2]].findIndex(cell => (cell[0] === row && cell[1] === col));
            const nextRowCell = primerPlacements[primerIndex];
            this.setConnectedCells(
                value,
                nextRowCell[0],
                nextRowCell[1],
                Number(level) + 1,
                (registeredIndex * 9) + currCell.position[2],
                false);
        }
    }
    setLoadString(loadKey: string) {
        this.loadKey = loadKey;
        this.boardsByLevel.length = Number(loadKey[0]);
        let mangledBoards = loadKey.substring(2).split('Z');
        for (let i = 0; i < this.boardsByLevel.length; i++) {
            this.boardsByLevel[i] = [];
            const numBoardsInLevel = Math.pow(9, i);
            this.boardsByLevel[i].length = numBoardsInLevel;
            for (let j = 0; j < numBoardsInLevel; j++) {
                const dehexed = mangledBoards[0];
                mangledBoards = mangledBoards.splice(1);
                let winningBoard = true;
                const inputPrimers = [];
                const newCellState = [ [], [], [], [], [], [], [], [], [] ];
                for (let m = 0; m < 81; m++) {
                    const startingIndex = m * 19;
                    const cell = {
                        clueByParent: !!Number(dehexed[startingIndex]),
                        flagValues: [],
                        hiddenByParent: false,
                        immutable: false,
                        isClue: false,
                        locked: false,
                        position: [0, 0, 0],
                        userAssignedValue: null,
                        value: null
                    };
                    cell.flagValues = dehexed.substr(startingIndex + 1, 9).split('').filter(x => !!x).map(z => Number(z));
                    cell.hiddenByParent = !!Number(dehexed[startingIndex + 10]);
                    cell.immutable = !!Number(dehexed[startingIndex + 11]);
                    cell.isClue = !!Number(dehexed[startingIndex + 12]);
                    cell.locked = !!Number(dehexed[startingIndex + 13]);
                    cell.position[0] = Number(dehexed[startingIndex + 14]);
                    cell.position[1] = Number(dehexed[startingIndex + 15]);
                    cell.position[2] = Number(dehexed[startingIndex + 16]);
                    cell.userAssignedValue = Number(dehexed[startingIndex + 17]);
                    cell.value = Number(dehexed[startingIndex + 18]);

                    newCellState[Math.floor(m / 9)].push(cell);
                    if (!cell.locked) {
                        winningBoard = false;
                    }
                    if (cell.immutable) {
                        inputPrimers.push(cell);
                    }
                }
                const parsedBoard = {
                    boardRegistryIndex: j,
                    cellStates: newCellState,
                    inputPrimers: inputPrimers,
                    isSolved: winningBoard,
                    level: i
                };
                this.boardsByLevel[i][j] = parsedBoard;
            }
        }
    }
    updateBoardBuildTimes(seconds: number): void {
        this.boardBuildTimes[seconds]++;
    }
}
