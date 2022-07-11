import { TestBed } from '@angular/core/testing';

import { FooterCreditoDebitoService } from './footer-notes.service';

describe('FooterCreditoDebitoService', () => {
  let service: FooterCreditoDebitoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterCreditoDebitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
