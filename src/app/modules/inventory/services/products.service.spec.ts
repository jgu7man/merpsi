import { TestBed } from '@angular/core/testing';

import { InventoryProductsService } from './products.service';

describe('ProductosService', () => {
  let service: InventoryProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
