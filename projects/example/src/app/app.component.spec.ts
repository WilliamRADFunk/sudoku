import { TestBed, async } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SudokuModule, BoardOverlordService } from 'sudoku';

import { AppComponent } from './app.component';
import { LoadTrackerService } from './services/load-tracker.service';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { PlayAreaComponent } from './play-area/play-area.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HelpScreenComponent } from './help-screen/help-screen.component';
import { LoadScreenComponent } from './load-screen/load-screen.component';
import { SaveScreenComponent } from './save-screen/save-screen.component';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
                FormsModule,
				NgbModule,
				SudokuModule
			],
			declarations: [
				AppComponent,
				StartMenuComponent,
				LoadingViewComponent,
				PlayAreaComponent,
				SidebarComponent,
				HelpScreenComponent,
				LoadScreenComponent,
				SaveScreenComponent
			],
			providers: [
				BoardOverlordService,
                LoadTrackerService
            ]
		});
	}));

	it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		app.content = '';
		expect(app).toBeTruthy();
	});
});
