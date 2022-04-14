import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConcept.DialogComponent } from './select-concept.dialog.component';

describe('SelectConcept.DialogComponent', () => {
  let component: SelectConcept.DialogComponent;
  let fixture: ComponentFixture<SelectConcept.DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectConcept.DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectConcept.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
