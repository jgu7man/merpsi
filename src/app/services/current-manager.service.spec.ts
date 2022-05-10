import { TestBed } from '@angular/core/testing';

import { CurrentManagerService } from './current-manager.service';

describe('CurrentManagerService', () => {
  let service: CurrentManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
