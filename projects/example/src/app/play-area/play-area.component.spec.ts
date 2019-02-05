// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Subject } from 'rxjs';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { BoardOverlordService, SudokuModule } from 'sudoku';

// import { PlayAreaComponent } from './play-area.component';
// import { LoadTrackerService } from '../services/load-tracker.service';

// fdescribe('PlayAreaComponent', () => {
//     let component: PlayAreaComponent;
//     let fixture: ComponentFixture<PlayAreaComponent>;
//     let loadTrackerService: LoadTrackerService;
//     let boardOverlordService: BoardOverlordService;
//     let currLoadAmount: Subject<number>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 NgbModule,
//                 SudokuModule
//             ],
//             declarations: [
//                 PlayAreaComponent
//             ],
//             providers: [
//                 BoardOverlordService,
//                 LoadTrackerService
//             ]
//         });
//         boardOverlordService = TestBed.get(BoardOverlordService);
//         loadTrackerService = TestBed.get(LoadTrackerService);
//     }));

//     beforeEach(async () => {
//         console.log('PlayAreaComponent - Before Test');
//         // spyOn(boardOverlordService, 'getBoardBuildTimes').and.returnValue([]);
//         // spyOn(loadTrackerService.currLoadAmount, 'subscribe');
//         currLoadAmount = new Subject<number>();
//         loadTrackerService.currLoadAmount = currLoadAmount;
//         console.log('PlayAreaComponent - Before Test 1');
//         fixture = await TestBed.createComponent(PlayAreaComponent);
//         component = fixture.componentInstance;
//         component.levels = undefined;
//         component.activeBoardIndex = -1;
//         console.log('PlayAreaComponent - Before Test 2');
//         fixture.detectChanges();
//         await fixture.whenStable();
//     });

//     it('should create', () => {
//         console.log('PlayAreaComponent - Test');
//         expect(component).toBeTruthy();
//     });
// });
