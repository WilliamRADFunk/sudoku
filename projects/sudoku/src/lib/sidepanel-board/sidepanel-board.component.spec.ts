import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidepanelBoardComponent } from './sidepanel-board.component';
import { BoardHandlerService } from '../services/board-handler.service';
import { SidepanelQuadrantComponent } from '../sidepanel-quadrant/sidepanel-quadrant.component';
import { SidepanelCellComponent } from '../sidepanel-cell/sidepanel-cell.component';

describe('SidepanelBoardComponent', () => {
  let component: SidepanelBoardComponent;
  let fixture: ComponentFixture<SidepanelBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidepanelBoardComponent,
				SidepanelQuadrantComponent,
				SidepanelCellComponent
      ],
			providers: [
				BoardHandlerService
			]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidepanelBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
