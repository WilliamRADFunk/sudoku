import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BoardOverlordService, SudokuModule } from 'sudoku';

import { PlayAreaComponent } from './play-area.component';
import { LoadTrackerService } from '../services/load-tracker.service';
import { FormsModule } from '@angular/forms';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let loadTrackerService: LoadTrackerService;
    let currLoadAmount: Subject<number>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                NgbModule,
                SudokuModule
            ],
            declarations: [
                PlayAreaComponent
            ],
            providers: [
                BoardOverlordService,
                LoadTrackerService
            ]
        });
        loadTrackerService = TestBed.get(LoadTrackerService);
    }));

    beforeEach(async () => {
        currLoadAmount = new Subject<number>();
        loadTrackerService.currLoadAmount = currLoadAmount;
        fixture = await TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        component.levels = undefined;
        component.activeBoardIndex = -1;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
