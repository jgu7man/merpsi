import { TestBed } from '@angular/core/testing';

import { DetailsConceptService } from './invoice-details.service';

describe('InvoiceConceptService', () => {
  let service: DetailsConceptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsConceptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
