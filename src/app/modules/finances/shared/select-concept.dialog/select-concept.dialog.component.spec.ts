import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConceptDialogComponent } from './select-concept.dialog.component';

describe('SelectConcept.DialogComponent', () => {
  let component: SelectConceptDialogComponent;
  let fixture: ComponentFixture<SelectConceptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectConceptDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectConceptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
