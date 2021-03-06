import { of } from 'rxjs';

import { Board } from '../models/board';
import { CellMaker } from './CellMaker';
import { Cell } from '../models/cell';
import { shuffle } from './shuffle';

export const quadLookup = {
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

export const placements: [number, number][] = [
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

export const primerPlacements: [number, number][] = [
	[1, 1], [1, 4], [1, 7],
	[4, 1], [4, 4], [4, 7],
	[7, 1], [7, 4], [7, 7],
];

export const quadrantCenters: { [key: number]: [number, number] } = {
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

export const opts: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const clueCutoff: number = 68;

let clueCount: number = 81;
let fillBail: boolean = false;
let fillCounter: number = 0;
let fillRowLast: number = 0;
let shuffledPlacements: [number, number][];

const getNeighbors = (row: number, col: number, board: Board, skipQuad?: boolean): number[] => {
    const neighbors = [
        ...board.cellStates[row].slice(0, col).filter(c => c && c.userAssignedValue).map(c => c.userAssignedValue),
        ...board.cellStates[row].slice(col + 1, 9).filter(c => c && c.userAssignedValue).map(c => c.userAssignedValue)
    ];
    for (let i = 0; i < 9; i++) {
        if (i === row || !(board.cellStates[i][col] && board.cellStates[i][col].userAssignedValue)) { continue; }
        neighbors.push(board.cellStates[i][col].userAssignedValue);
    }

    if (!skipQuad) {
        const quadCenter = quadrantCenters[quadLookup[row][col]];
        for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
                const cell = board.cellStates[quadCenter[0] + j][quadCenter[1] + k];
                const val = cell && cell.userAssignedValue;
                if (val) { neighbors.push(val); }
            }
        }
    }
    return neighbors;
};

const fillCell = (row: number, col: number, board: Board): boolean => {
    if (col >= 9) {
        row++;
        col = 0;
    }
    if (row >= 9) { return true; }
    // Max attempts to make this board attempt reached.
    // Go straight back to the beginning.
    // Do not pass Go. Do not collect another recursive loop.
    if (fillBail) { return false; }

    const neighbors = getNeighbors(row, col, board);
    const options = shuffle(opts.filter(y => !neighbors.includes(y)));
    // Chosen based off cells in upper level.
    const primer = board.cellStates[row][col];
    if (primer && primer.immutable) {
        // If the same row is checked in... a row, this is a bad board config.
        if (fillRowLast === row && fillCounter > 1000) {
            fillBail = true;
            return false;
        } else {
            fillRowLast = row;
            fillCounter++;
        }
        return fillCell(row, col + 1, board);
    }

    let counter = 0;
    const cell: Cell = {
        clueByParent: false,
        flagValues: [],
        immutable: false,
        isClue: true,
        position: [row, col, quadLookup[row][col]],
        userAssignedValue: 0,
        value: 0
    };

    do {
        if (!options[counter] || counter >= 9) {
            board.cellStates[row][col] = null;
            return false;
        }
        cell.value = options[counter];
        cell.userAssignedValue = options[counter];
        board.cellStates[row][col] = cell;
        counter++;
    } while (!fillCell(row, col + 1, board));

    return true;
};

const guessAtCell = (index: number, board: Board): boolean => {
    if (index >= placements.length) {
        return true;
    }

    const place = placements[index];
    if (board.cellStates[place[0]][place[1]].isClue) {
        return guessAtCell(index + 1, board);
    }

    const neighbors = getNeighbors(place[0], place[1], board);
    const options = shuffle(opts.filter(y => !neighbors.includes(y)));

    // If too many options exist for any given cell,
    // the permutations will be ridiculous.
    if (!options.length || options.length > 2) {
        return false;
    }

    let counter = 0;
    for (let i = 0; i < options.length; i++) {
        board.cellStates[place[0]][place[1]].userAssignedValue = options[i];
        if (guessAtCell(index + 1, board)) {
            counter++;
        }
        board.cellStates[place[0]][place[1]].userAssignedValue = 0;
        if (counter > 1) { break; }
    }

    if (counter !== 1) {
        return false;
    } else {
        return true;
    }
};

const obscureCells = (board: Board): boolean => {
    for (let i = 0; i < shuffledPlacements.length; i++) {
        const place = shuffledPlacements[i];
        const currCell = board.cellStates[place[0]][place[1]];

        currCell.isClue = false;
        currCell.userAssignedValue = 0;
        // Has to be a clue to make a unique solution
        if (currCell.clueByParent || !guessAtCell(0, board)) {
            currCell.isClue = true;
            currCell.userAssignedValue = currCell.value;
            clueCount--;
        }
        // The parent chose to hide this connected cell.
        // If this board can't support this iteration without making it a clue, start again.
        if (currCell.isClue && currCell.hiddenByParent) {
            return false;
        }
        // Cutoff if too many clues needed before cutoff
        // (Board too complex. Make new one.)
        if (clueCount <= 66) {
            return false;
        }
        if (i >= clueCutoff && shuffledPlacements.slice(i).some(p => board.cellStates[p[0]][p[1]].hiddenByParent)) {
            return false;
        }
        // The last cutoff amount (71 last checked) is good enough. Rest can be clues.
        if (i >= clueCutoff) {
            clueCount -= (81 - clueCutoff - 1);
            return true;
        }
    }
};

export const solveCheck = (index: number, board: Board) => {
    if (index >= placements.length) {
        return true;
    }
    const place = placements[index];
    if (board.cellStates[place[0]][place[1]].isClue) {
        return solveCheck(index + 1, board);
    }
    const neighbors = getNeighbors(place[0], place[1], board, true);
    const choice = board.cellStates[place[0]][place[1]].userAssignedValue;
    if (!choice) {
        return false;
    }
    if (neighbors.includes(choice)) {
        return false;
    }
    return solveCheck(index + 1, board);
};

export const stringify = (b: Board): string => {
    let map = '';
    b.cellStates.forEach(row => {
        map += row.map(c => c.userAssignedValue + '').reduce((str, val) => {
            return str += val;
        });
    });
    return map;
};

export const BoardBuilder = async (
    primers: Cell[],
    level: number,
    boardRegistryIndex: number
): Promise<{ board: Board; clueCount: number }> => {
    // Reset file variables
    clueCount = 81;
    fillBail = false;
    fillCounter = 0;
    fillRowLast = 0;
    shuffledPlacements = [];

    primers = primers || null;
    let successfulBuild = true;
    const board = {
        boardRegistryIndex: boardRegistryIndex,
        cellStates: [],
        inputPrimers: primers,
        isSolved: false,
        level: level
    };
    // Retries if a generated board requires too many clues to be unique.
    do {
        board.cellStates = [ [], [].fill(null, 0, 9), [], [], [].fill(null, 0, 9), [], [], [].fill(null, 0, 9), [] ];
        if (primers) {
            primerPlacements.forEach((pl, index) => {
                board.cellStates[pl[0]][pl[1]] = CellMaker(
                    primers[index].value, [pl[0], pl[1], index], true, primers[index].isClue);
            });
        }
        clueCount = 81;
        shuffledPlacements = shuffle(placements.slice());
        fillCounter = 0;
        fillRowLast = 0;
        fillBail = false;
        successfulBuild = fillCell(0, 0, board);
    } while (!successfulBuild || !obscureCells(board));
    const boardCopy: Board = JSON.parse(JSON.stringify(board));
    return of({ board: boardCopy, clueCount }).toPromise();
};
