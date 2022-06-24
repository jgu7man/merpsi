import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCreditNoteComponent } from './select-credit-note.component';

describe('SelectCreditNoteComponent', () => {
  let component: SelectCreditNoteComponent;
  let fixture: ComponentFixture<SelectCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
