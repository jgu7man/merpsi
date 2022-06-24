import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDebitNoteComponent } from './select-debit-note.component';

describe('SelectDebitNoteComponent', () => {
  let component: SelectDebitNoteComponent;
  let fixture: ComponentFixture<SelectDebitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDebitNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
