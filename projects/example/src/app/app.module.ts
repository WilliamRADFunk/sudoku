import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PlayAreaComponent } from './play-area/play-area.component';
import { SudokuModule } from 'sudoku';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HelpScreenComponent } from './help-screen/help-screen.component';
import { LoadScreenComponent } from './load-screen/load-screen.component';
import { SaveScreenComponent } from './save-screen/save-screen.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
        AppComponent,
        PlayAreaComponent,
        StartMenuComponent,
        LoadingViewComponent,
		SidebarComponent,
		HelpScreenComponent,
		LoadScreenComponent,
		SaveScreenComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		NgbModule,
		SudokuModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
