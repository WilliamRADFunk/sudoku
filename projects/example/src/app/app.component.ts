import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { LoadTrackerService } from './services/load-tracker.service';
import { BoardOverlordService } from 'sudoku';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    activeBoard: number = -1;
    boardsCompleted: number = 0;
    chosenViewBoard: number[] = [-1];
    @ViewChild('content') content: any;
    gameOver: boolean = false;
    helpMode: boolean = false;
    levels: number;
    loadedAmount: number = 0;
    subs: Subscription[] = [];
    totalNumberOfBoards: number = 0;

    constructor(
        private readonly boardOverlordService: BoardOverlordService,
        private readonly loadTrackerService: LoadTrackerService,
        private modalService: NgbModal) {}

    ngOnDestroy() {
        this.subs.forEach(sub => sub && sub.unsubscribe());
        this.subs.length = 0;
    }

    ngOnInit() {
        this.subs.push(this.boardOverlordService.numCompletedBoards
            .pipe(distinctUntilChanged())
            .subscribe(numBoards => {
                this.boardsCompleted = numBoards;
            }));
        this.subs.push(this.loadTrackerService.currLoadAmount.subscribe(amt => {
            setTimeout(() => { this.loadedAmount = amt; }, 200);
        }));
        this.subs.push(this.boardOverlordService.gameOver.subscribe(go => {
            this.gameOver = go;
            if (this.gameOver) {
                this.modalService.open(this.content, {
                    centered: true,
                    size: 'lg',
                    windowClass: 'transparent-modal'
                }).result.then(() => {
                        // Already handled this means of closing the modal.
                    }, reason => {
                        // Since player clicked outside modal, have to handle the restart.
                        if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                            this.goToMenu();
                        }
                    });
            }
        }));
    }

    choseBoardView(num: number, level: number) {
        if (level < this.chosenViewBoard.length - 1) {
            this.chosenViewBoard.length = level + 1;
        }
        this.chosenViewBoard[level || 0] = num;
        this.updateActiveBoard();
    }

    enterHelp(e: boolean) {
        this.helpMode = true;
    }

    exitHelp() {
        this.helpMode = false;
    }

    getLevelArray() {
        return Array(this.levels).fill(1, 0, this.levels);
    }

    getLevelOptions(levelIndex: number) {
        if (!levelIndex) {
            return [2, 3, 4, 5, 6, 7, 8, 9, 10];
        } else if (levelIndex === 1) {
            const base = (Math.pow(9, levelIndex) + 2) + (this.chosenViewBoard[levelIndex] * 9);
            return [base, base + 1, base + 2, base + 3, base + 4, base + 5, base + 6, base + 7, base + 8];
        } else {
            let totalB4 = 0;
            for (let i = 0; i < levelIndex; i++) {
                totalB4 += Math.pow(9, i);
            }
            const base = totalB4 + (this.chosenViewBoard[levelIndex] * 9) + 1;
            const ans = [base, base + 1, base + 2, base + 3, base + 4, base + 5, base + 6, base + 7, base + 8];
            return ans;
        }
    }

    getLevelsExposed() {
        if (this.chosenViewBoard.length === -1) {
            return [1];
        }
        return this.chosenViewBoard.length < this.levels ? Array(this.chosenViewBoard.length) : Array(this.levels - 1);
    }

    goToMenu() {
        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll();
        }
        this.subs.forEach(sub => sub && sub.unsubscribe());
        this.loadTrackerService.restart();
        this.subs.push(this.loadTrackerService.currLoadAmount.subscribe(amt => {
            setTimeout(() => { this.loadedAmount = amt; }, 200);
        }));
        this.subs.push(this.boardOverlordService.gameOver.subscribe(go => {
            this.gameOver = go;
            if (this.gameOver) {
                this.modalService.open(this.content, {
                        centered: true,
                        size: 'lg',
                        windowClass: 'transparent-modal'
                }).result.then(() => {
                        // Already handled this means of closing the modal.
                    }, reason => {
                        // Since player clicked outside modal, have to handle the restart.
                        if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                            this.goToMenu();
                        }
                    });
            }
        }));
        this.levels = 0;
        this.activeBoard = -1;
        this.chosenViewBoard = [-1];
        this.loadedAmount = 0;
        this.totalNumberOfBoards = 0;
        this.boardOverlordService.flushBoards();
    }

    isDoneLoading() {
        return this.loadedAmount >= 100;
    }

    powerFactorial(n) {
        if (n <= 0) {
            return 0;
        }
        return Math.pow(9, n) + Math.pow(9, (n - 1));
    }

    startGame(level: number): void {
        this.levels = level;
        for (let i = 0; i < this.levels; i++) {
            this.totalNumberOfBoards += Math.pow(9, i);
        }
    }

    updateActiveBoard() {
        // Only 0 index is single top level board.
        if (this.chosenViewBoard.length === 1) {
            this.activeBoard = -1;
            return;
        }
        // 1st index has no multiplier. It's 0-8 indices.
        if (this.chosenViewBoard.length === 2) {
            this.activeBoard = this.chosenViewBoard[1];
            return;
        }
        this.activeBoard = this.chosenViewBoard[this.chosenViewBoard.length - 1];
    }
}
