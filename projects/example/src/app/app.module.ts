import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PlayAreaComponent } from './play-area/play-area.component';
import { SudokuModule } from 'sudoku';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';

@NgModule({
	declarations: [
        AppComponent,
        PlayAreaComponent,
        StartMenuComponent,
        LoadingViewComponent
	],
	imports: [
		BrowserModule,
		NgbModule,
		SudokuModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
