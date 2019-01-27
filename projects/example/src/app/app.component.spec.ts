import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SudokuModule } from 'sudoku';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadTrackerService } from './services/load-tracker.service';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { PlayAreaComponent } from './play-area/play-area.component';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				NgbModule,
				SudokuModule
			],
			declarations: [
				AppComponent,
				StartMenuComponent,
				LoadingViewComponent,
				PlayAreaComponent
			],
			providers: [ LoadTrackerService ]
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
