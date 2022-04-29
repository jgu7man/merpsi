import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConceptSalesDialogComponent } from './select-concept-sales-dialog.component';

describe('SelectConceptSalesDialogComponent', () => {
  let component: SelectConceptSalesDialogComponent;
  let fixture: ComponentFixture<SelectConceptSalesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectConceptSalesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectConceptSalesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
