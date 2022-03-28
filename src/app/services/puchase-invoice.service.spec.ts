import { TestBed } from '@angular/core/testing';

import { PuchaseInvoiceService } from './puchase-invoice.service';

describe('PuchaseInvoiceService', () => {
  let service: PuchaseInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuchaseInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
