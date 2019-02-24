import { Component, EventEmitter, Output } from '@angular/core';
import { LoadTrackerService } from '../services/load-tracker.service';

@Component({
    selector: 'sudoku-start-menu',
    templateUrl: './start-menu.component.html',
    styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent {
    activeLevel: number = 1;
    @Output() levelSelected: EventEmitter<number> = new EventEmitter<number>();

    constructor(private readonly loadTrackerService: LoadTrackerService) { }

    getTooltipMsg(num: number): string {
        switch (num) {
            case 1: {
                return 'Build time less than 2 seconds';
            }
            case 2: {
                return 'Build time less than 10 seconds';
            }
            case 3: {
                return 'Build time can take up to 2 minutes';
            }
            case 4: {
                return 'Build time can take more than 10 minutes';
            }
            case 5: {
                return 'Build time can take 1.5 hours (Don\'t do it).';
            }
            default: {
                return 'Not a valid option';
            }
        }
    }

    levelChange(level: number): void {
        this.activeLevel = (level >= 1 && 5 >= level) ? level : 1;
    }

    startGame(): void {
        this.levelSelected.emit(this.activeLevel);
    }

}
