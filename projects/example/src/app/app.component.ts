import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadTrackerService } from './services/load-tracker.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    chosenViewLevel: number = 1;
    levels: number;
    loadedAmount: number = 0;
    sub: Subscription;

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

    choseLevelView(num: number) {
        this.chosenViewLevel = num;
    }

    getLevelArray() {
        return Array(this.levels).fill(1, 0, this.levels);
    }

    isDoneLoading() {
        return this.loadedAmount >= 100;
    }

    startGame(level: number): void {
        this.levels = level;
    }
}
