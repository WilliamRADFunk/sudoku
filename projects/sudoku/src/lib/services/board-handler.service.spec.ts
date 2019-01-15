import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BoardHandlerService } from './board-handler.service';

describe('BoardHandlerService', () => {
	beforeEach(async() => TestBed.configureTestingModule({
        imports: [
            RouterTestingModule
        ],
        providers: [
            BoardHandlerService
        ]
    }));

	it('should be created', () => {
		const service: BoardHandlerService = TestBed.get(BoardHandlerService);
		expect(service).toBeTruthy();
	});
});
