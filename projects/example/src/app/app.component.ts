import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadTrackerService } from './services/load-tracker.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    activeBoard: number = -1;
    chosenViewBoard: number[] = [-1];
    levels: number;
    loadedAmount: number = 0;
    sub: Subscription;
    totalNumberOfBoards: number = 0;

    constructor(private readonly loadTrackerService: LoadTrackerService) {}

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    ngOnInit() {
        this.loadTrackerService.currLoadAmount.subscribe(amt => {
            setTimeout(() => { this.loadedAmount = amt; }, 200);
        });
    }

    choseBoardView(num: number, level: number) {
        if (level < this.chosenViewBoard.length - 1) {
            this.chosenViewBoard.length = level + 1;
        }
        this.chosenViewBoard[level || 0] = num;
        console.log('choseBoardView', num, level, this.chosenViewBoard[level || 0]);
        this.updateActiveBoard();
    }

    getLevelArray() {
        return Array(this.levels).fill(1, 0, this.levels);
    }

    getLevelOptions(levelIndex: number) {
        if (!levelIndex) {
            return [2, 3, 4, 5, 6, 7, 8, 9, 10];
        } else {
            const base = (Math.pow(9, levelIndex) + 2) + (this.chosenViewBoard[levelIndex] * 9);
            console.log('getLevelOptions', base);
            return [base, base + 1, base + 2, base + 3, base + 4, base + 5, base + 6, base + 7, base + 8];
        }
    }

    getLevelsExposed() {
        if (this.chosenViewBoard.length === -1) {
            return [1];
        }
        return this.chosenViewBoard.length < this.levels ? Array(this.chosenViewBoard.length) : Array(this.levels - 1);
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
        // A convoluted way of navigating through an exponentially
        // increasing number of connected boards.
        let index = this.powerFactorial(this.chosenViewBoard.length - 2) - 1;
        for (let i = 2; i <= this.chosenViewBoard.length - 1; i++) {
            index += this.chosenViewBoard[i - 1] * Math.pow(9, (i - 1));
        }
        index += this.chosenViewBoard[this.chosenViewBoard.length - 1];
        if (this.chosenViewBoard.length > 3) {
            index += 1;
        }
        this.activeBoard = index;
    }
}
