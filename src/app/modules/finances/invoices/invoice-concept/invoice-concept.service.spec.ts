import { TestBed } from '@angular/core/testing';

import { InvoiceConceptService } from './invoice-concept.service';

describe('InvoiceConceptService', () => {
  let service: InvoiceConceptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceConceptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
