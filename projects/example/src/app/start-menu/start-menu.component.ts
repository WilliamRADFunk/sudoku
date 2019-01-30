import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'sudoku-start-menu',
    templateUrl: './start-menu.component.html',
    styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent {
    activeLevel: number = 1;
    @Output() levelSelected: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    getTooltipMsg(num: number): string {
        switch (num) {
            case 1: {
                return 'Build time less than 5 seconds';
            }
            case 2: {
                return 'Build time can take up to a minute';
            }
            case 3: {
                return 'Build time can take between 5 and 8 minutes';
            }
            default: {
                return 'Not a valid option';
            }
        }
    }

    levelChange(level: number): void {
        this.activeLevel = (level >= 1 && 3 >= level) ? level : 1;
    }

    startGame(): void {
        this.levelSelected.emit(this.activeLevel);
    }

}
