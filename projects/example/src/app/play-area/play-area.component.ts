import { Component, OnChanges, OnDestroy, OnInit, Input, SimpleChanges } from '@angular/core';
import { Board, BoardBuilder, BoardOverlordService, Cell } from 'sudoku';
import { LoadTrackerService } from '../services/load-tracker.service';
import { Subscription } from 'rxjs';
import { getLevel } from '../utils/get-level';
import { getBoardRegistryIndex } from '../utils/get-board-registry-index';

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
export class PlayAreaComponent implements OnChanges, OnDestroy, OnInit {
    activeBoard: Board;
    @Input() activeBoardIndex: number;
    @Input() levels: number;
    private mainCounter: number;
    sub: Subscription;
    private totalNumberOfBoards: number = 0;

    constructor(
        private readonly boardOverlordService: BoardOverlordService,
        private readonly loadTrackerService: LoadTrackerService) { }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    async ngOnInit(): Promise<void> {
        const startTime = new Date().getTime();
        this.loadTrackerService.currLoadAmount.subscribe(amt => {
            if (!amt) {
                return;
            } else if (amt < 100) {
                setTimeout(() => {
                    this.addAnotherBoard();
                }, 250);
            } else {
                console.log(`Total Time to build ${this.levels} levels: ${(new Date().getTime() - startTime) / 60000} minutes`);
                let boardBuildMsg = 'Number of boards by seconds:\n';
                this.boardOverlordService.getBoardBuildTimes().forEach((quantity, index) => {
                    if (quantity) {
                        boardBuildMsg += `Boards taking ${index} second${quantity === 1 ? '' : 's'}: ${quantity}\n`;
                    }
                });
                console.log(boardBuildMsg);
            }
        });
        // Determine total number of boards to build.
        for (let i = 0; i < this.levels; i++) {
            this.totalNumberOfBoards += Math.pow(9, i);
        }
        // There will always be at least 1 level, and 1 board. Build that first.
        const board1 = (await BoardBuilder(null, 0, 0)).board;
        this.mainCounter = 1;
        this.boardOverlordService.updateBoardBuildTimes(1);
        this.boardOverlordService.registerBoard(board1);
        this.activeBoard = board1;
        if (this.mainCounter / this.totalNumberOfBoards < 1) {
            this.loadTrackerService.updateLoad((this.mainCounter / this.totalNumberOfBoards) * 100);
        } else {
            this.loadTrackerService.updateLoad(100);
        }
    }

    ngOnChanges(e: SimpleChanges) {
        if (e.activeBoardIndex && !e.levels) {
            const index = e.activeBoardIndex.currentValue;
            if (index === -1) {
                this.activeBoard = this.boardOverlordService.getBoard(0, 0);
            } else {
                this.activeBoard = this.boardOverlordService.getBoard(
                    getLevel(index, this.levels),
                    getBoardRegistryIndex(index, this.levels, this.boardOverlordService));
            }
        }
    }

    async addAnotherBoard(): Promise<void> {
        // Starts index at 0 and iterates from there as this
        // is what made the template iterations work best.
        const index = this.mainCounter - 1;
        // Calculate new board's level.
        const boardLvl = getLevel(index, this.levels);
        // Index location board lives on in its level array (easier lookup).
        const boardRegistryIndex = getBoardRegistryIndex(index, this.levels, this.boardOverlordService);
        // Primers from the related board in the level above.
        const inputPrimers = this.getPrimers(index, boardLvl - 1);
        // TODO: Next line can be deleted when all is said and done.
        const start = new Date().getTime();

        // Builds the next board.
        const anotherBoardConstruct = (await BoardBuilder(inputPrimers, boardLvl, boardRegistryIndex));

        // TODO: Next two lines can be deleted when all is said and done.
        const timeTaken = (new Date().getTime() - start) / 1000;
        console.log('BuildTime: ', timeTaken, 'Seconds, ', (81 - anotherBoardConstruct.clueCount), 'Clues');

        // Let overlord know another board is ready.
        this.boardOverlordService.updateBoardBuildTimes(Math.ceil(timeTaken));
        this.boardOverlordService.registerBoard(anotherBoardConstruct.board);

        // Iterate mainCounter to track number of currently existing boards.
        this.mainCounter++;
        this.loadTrackerService.updateLoad((this.mainCounter / this.totalNumberOfBoards) * 100);
    }

    getBoardRegistryIndex(activeBoardIndex: number) {
        return getBoardRegistryIndex(activeBoardIndex, this.levels, this.boardOverlordService);
    }

    getLevel(index: number) {
        return getLevel(index, this.levels);
    }

    getPrimers(index: number, relatedLevel: number): Cell[] {
        const quadrant = index % 9;
        const quadPosList = quadrantPositions[quadrant].slice();
        let parentBoardIndex = 0;
        let totalSubstracted = 0;
        if (index) {
            for (let i = relatedLevel; i > 0; i--) {
                totalSubstracted += this.boardOverlordService.getLevelLength(i);
            }
            parentBoardIndex = Math.floor(Math.abs(index - 1 - totalSubstracted) / 9);
        }
        const boardInQuestion = this.boardOverlordService.getBoard(relatedLevel, parentBoardIndex).cellStates;
        return quadPosList.map(pos => JSON.parse(JSON.stringify(boardInQuestion[pos[0]][pos[1]])));
    }
}
