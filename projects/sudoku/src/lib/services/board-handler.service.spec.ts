import { TestBed } from '@angular/core/testing';

import { BoardHandlerService } from './board-handler.service';

describe('BoardHandlerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: BoardHandlerService = TestBed.get(BoardHandlerService);
		expect(service).toBeTruthy();
	});
});