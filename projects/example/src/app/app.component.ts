import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
    levels: number;

    constructor() {}

    startGame(level: number): void {
        this.levels = level;
    }
}
