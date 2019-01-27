import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadTrackerService } from './services/load-tracker.service';
import { Subscription } from 'rxjs';
import { BoardOverlordService } from 'sudoku/lib/services/board-overlord.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    chosenViewBoard: number = 0;
    levels: number;
    loadedAmount: number = 0;
    sub: Subscription;

    constructor(
        private readonly boardOverlordService: BoardOverlordService,
        private readonly loadTrackerService: LoadTrackerService) {}

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    ngOnInit() {
        console.log('levels', this.levels);
        this.loadTrackerService.currLoadAmount.subscribe(amt => {
            setTimeout(() => { this.loadedAmount = amt; }, 200);
        });
    }

    choseBoardView(num: number) {
        this.chosenViewBoard = num;
    }

    getLevelArray() {
        return Array(this.levels).fill(1, 0, this.levels);
    }

    getLevelsExposed() {
        if (!this.chosenViewBoard) {
            return [1];
        }
        let remainder = this.chosenViewBoard + 9;
        for (let i = 1; i < this.levels; i++) {
            remainder -= Math.pow(9, i);
            if (remainder < 0) {
                console.log('getLevelsExposed', Array(Math.max(i, 1)).fill(1));
                return Array(Math.max(i, 1)).fill(1);
            }
        }
    }

    getMidLevel(num) {
        return (num === Math.floor(this.chosenViewBoard / 9));
    }

    isDoneLoading() {
        return this.loadedAmount >= 100;
    }

    startGame(level: number): void {
        this.levels = level;
    }
}
