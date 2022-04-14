import { TestBed } from '@angular/core/testing';

import { MesureUnitsService } from './mesure-units.service';

describe('MesureUnitsService', () => {
  let service: MesureUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesureUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
