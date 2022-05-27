import { TestBed } from '@angular/core/testing';

import { InvoiceConceptSalesService } from './invoice-concept-sales.service';

describe('InvoiceConceptSalesService', () => {
  let service: InvoiceConceptSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceConceptSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
