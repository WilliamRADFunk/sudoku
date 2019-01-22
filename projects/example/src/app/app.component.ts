import { Component } from '@angular/core';
import { Board, Cell } from 'sudoku';

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

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public readonly boardsByLevel: Board[][] = [];
    subBoardIterations: number[] = [];
    numOfLevels = 3;
    mainCounter: number = 0;
    startTime: number;

    constructor() {
        let count = 0;
        for (let i = 1; i < Math.pow(9, this.numOfLevels - 1) + 1; i++) {
            count++;
            this.subBoardIterations.push(i);
        }
        this.startTime = new Date().getTime();
        console.log('Boards: ', count + 1);
    }

    boardChanged(board: Board): void {
        this.mainCounter++;
        if (!this.boardsByLevel[board.level]) {
            this.boardsByLevel[board.level] = [];
        }
        this.boardsByLevel[board.level][board.parentQuadrant] = board;
        if (this.mainCounter >= Math.pow(9, this.numOfLevels - 1)) {
            console.log(`Total Time to build ${this.numOfLevels} levels: ${(new Date().getTime() - this.startTime) / 60000}`);
        }
    }

    getLevel(index: number): number {
        const level = Math.floor(this.log9(Math.max(index, 1))) + 1;
        return level;
    }

    getParentQuadrant(index: number): number {
        return Math.max(Math.floor(this.log9(index + 1)) - 9, 0);
    }

    getPrimers(index: number, relatedLevel: number): Cell[] {
        const quadrant = index % 9;
        const quadPosList = quadrantPositions[quadrant].slice();
        return quadPosList.map(pos => {
            return JSON.parse(JSON.stringify(
                this.boardsByLevel[relatedLevel][Math.max(Math.floor(this.log9(index + 1)) - 9, 0)].cellStates[pos[0]][pos[1]]
            ));
        });
    }

    log9(n) {
        return Math.log(n) / (9 ? Math.log(9) : 1);
    }
}
