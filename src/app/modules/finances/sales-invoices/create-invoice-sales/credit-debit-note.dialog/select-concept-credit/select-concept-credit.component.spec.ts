import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConceptCreditComponent } from './select-concept-credit.component';

describe('SelectConceptCreditComponent', () => {
  let component: SelectConceptCreditComponent;
  let fixture: ComponentFixture<SelectConceptCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectConceptCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectConceptCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
