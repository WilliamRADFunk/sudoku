import { TestBed } from '@angular/core/testing';

import { BoardOverlordService } from './board-overlord.service';

describe('BoardOverlordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardOverlordService = TestBed.get(BoardOverlordService);
    expect(service).toBeTruthy();
  });
});
