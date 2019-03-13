import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrantComponent } from './quadrant.component';
import { CellComponent } from '../cell/cell.component';
import { BoardHandlerService } from '../services/board-handler.service';

describe('QuadrantComponent', () => {
	let component: QuadrantComponent;
	let fixture: ComponentFixture<QuadrantComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				QuadrantComponent,
				CellComponent
			],
			providers: [
				BoardHandlerService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QuadrantComponent);
		component = fixture.componentInstance;
		component.board = {
            cellStates: [],
            inputPrimers: [],
            isSolved: false,
            level: 0,
            boardRegistryIndex: 0
        };
		component.quadrant = 0;
		component.reveal = false;
		component.showQuadrant = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
