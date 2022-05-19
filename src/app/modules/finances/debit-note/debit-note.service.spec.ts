import { TestBed } from '@angular/core/testing';

import { DebitNoteService } from './debit-note.service';

describe('DebitNoteService', () => {
  let service: DebitNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebitNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
