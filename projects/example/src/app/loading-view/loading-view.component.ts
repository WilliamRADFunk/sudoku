import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadTrackerService } from '../services/load-tracker.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sudoku-loading-view',
    templateUrl: './loading-view.component.html',
    styleUrls: ['./loading-view.component.scss']
})
export class LoadingViewComponent implements OnDestroy, OnInit {
    loadedAmount: number = 0;
    sub: Subscription;

    constructor(private readonly loadTrackerService: LoadTrackerService) { }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    ngOnInit() {
        this.sub = this.loadTrackerService.currLoadAmount.subscribe(amt => {
            this.loadedAmount = amt;
        });
    }

}
