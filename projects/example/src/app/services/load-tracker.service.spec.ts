import { TestBed } from '@angular/core/testing';

import { LoadTrackerService } from './load-tracker.service';

describe('LoadTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadTrackerService = TestBed.get(LoadTrackerService);
    expect(service).toBeTruthy();
  });
});
