import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Board, Cell } from 'sudoku';
import { LoadTrackerService } from '../services/load-tracker.service';

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
  selector: 'sudoku-play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.scss']
})
export class PlayAreaComponent implements OnInit {
    public readonly boardsByLevel: Board[][] = [];
    @Input() levels: number;
    private mainCounter: number = 0;
    private startTime: number;
    subBoardIterations: number[] = [];
    private totalNumberOfBoards: number = 0;

    constructor(private readonly loadTrackerService: LoadTrackerService) { }

    ngOnInit() {
        this.startTime = new Date().getTime();
        this.loadTrackerService.currLoadAmount.subscribe(amt => {
            console.log('Load Amount', amt);
            if (amt < 100) {
                setTimeout(() => { this.subBoardIterations.push(this.mainCounter); }, 250);
            } else {
                console.log(`Total Time to build ${this.levels} levels: ${(new Date().getTime() - this.startTime) / 60000}`);
            }
        });
        for (let i = 0; i < this.levels; i++) {
            this.totalNumberOfBoards += Math.pow(9, i);
        }
    }

    boardChanged(board: Board): void {
        this.mainCounter++;
        if (!this.boardsByLevel[board.level]) {
            this.boardsByLevel[board.level] = [];
        }
        this.boardsByLevel[board.level][board.boardRegistryIndex] = board;
        if (this.levels > 1) {
            this.loadTrackerService.updateLoad((this.mainCounter / this.totalNumberOfBoards) * 100);
        } else {
            this.loadTrackerService.updateLoad(100);
        }
    }
    // TODO: Still fine-tuning.
    getLevel(index: number): number {
        if (index < 9) {
            return 1;
        }
        let remainder = index;
        for (let i = 0; i < this.levels; i++) {
            remainder -= Math.max(Math.pow(9, i) - 1, 0);
            if (remainder <= 0) {
                return i;
            }
        }
    }

    getBoardRegistryIndex(index: number): number {
        if (!index) {
            return 0;
        } else if (this.getLevel(index) > 1) {
            return Math.abs(index - this.boardsByLevel[this.getLevel(index) - 1].length);
        } else {
            return Math.abs(index + 1 - this.boardsByLevel[this.getLevel(index) - 1].length);
        }
    }

    getPrimers(index: number, relatedLevel: number): Cell[] {
        const quadrant = index % 9;
        const quadPosList = quadrantPositions[quadrant].slice();
        let parentBoardIndex = 0;
        if (index) {
            parentBoardIndex = Math.floor(Math.abs(index - this.boardsByLevel[this.getLevel(index) - 1].length) / 9);
        }
        const boardInQuestion = this.boardsByLevel[relatedLevel][parentBoardIndex].cellStates;
        return quadPosList.map(pos => JSON.parse(JSON.stringify(boardInQuestion[pos[0]][pos[1]])));
    }

    log9(n) {
        return Math.log(n) / (9 ? Math.log(9) : 1);
    }
}
