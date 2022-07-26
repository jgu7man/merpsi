import { TestBed } from '@angular/core/testing';

import { DatabasePathsService } from './database-paths.service';

describe('DatabasePathsService', () => {
  let service: DatabasePathsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabasePathsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
