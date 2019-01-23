import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'sudoku-start-menu',
    templateUrl: './start-menu.component.html',
    styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent implements OnInit {
    activeLevel: number = 1;
    @Output() levelSelected: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    ngOnInit() { }

    levelChange(level: number): void {
        this.activeLevel = (level >= 1 && 3 >= level) ? level : 1;
    }

    startGame(): void {
        this.levelSelected.emit(this.activeLevel);
    }

}
