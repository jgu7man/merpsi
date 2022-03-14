import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSedeDialog } from './delete-sede.dialog';

describe('DeleteSedeDialog', () => {
  let component: DeleteSedeDialog;
  let fixture: ComponentFixture<DeleteSedeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSedeDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSedeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
