import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDebitNote.DialogComponent } from './credit-debit-note.dialog.component';

describe('CreditDebitNote.DialogComponent', () => {
  let component: CreditDebitNote.DialogComponent;
  let fixture: ComponentFixture<CreditDebitNote.DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditDebitNote.DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditDebitNote.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
