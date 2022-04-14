import { TestBed } from '@angular/core/testing';

import { CurrentProductService } from './current-product.service';

describe('CurrentProductService', () => {
  let service: CurrentProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
