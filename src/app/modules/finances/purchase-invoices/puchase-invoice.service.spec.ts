import { TestBed } from '@angular/core/testing';

import { PurchaseInvoiceService } from './puchase-invoice.service';

describe('PuchaseInvoiceService', () => {
  let service: PurchaseInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
