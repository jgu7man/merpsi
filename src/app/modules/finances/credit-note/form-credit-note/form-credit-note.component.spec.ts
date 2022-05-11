import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreditNoteComponent } from './form-credit-note.component';

describe('FormCreditNoteComponent', () => {
  let component: FormCreditNoteComponent;
  let fixture: ComponentFixture<FormCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
