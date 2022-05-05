import { TestBed } from '@angular/core/testing';

import { ArqueosService } from './arqueos.service';

describe('ArqueosService', () => {
  let service: ArqueosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArqueosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
