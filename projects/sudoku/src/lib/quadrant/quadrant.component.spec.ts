import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrantComponent } from './quadrant.component';
import { CellComponent } from '../cell/cell.component';

describe('QuadrantComponent', () => {
	let component: QuadrantComponent;
	let fixture: ComponentFixture<QuadrantComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				QuadrantComponent,
				CellComponent
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QuadrantComponent);
		component = fixture.componentInstance;
		component.board = [];
		component.quadrant = 0;
		component.reveal = false;
		component.showQuadrant = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
