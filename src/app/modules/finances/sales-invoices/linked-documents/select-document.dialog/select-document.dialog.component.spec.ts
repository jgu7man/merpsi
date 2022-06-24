import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDocument.DialogComponent } from './select-document.dialog.component';

describe('SelectDocument.DialogComponent', () => {
  let component: SelectDocument.DialogComponent;
  let fixture: ComponentFixture<SelectDocument.DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDocument.DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDocument.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
