import { TestBed } from '@angular/core/testing';

import { CountingsService } from './countings.service';

describe('ArqueosService', () => {
  let service: CountingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
