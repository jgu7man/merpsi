import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUsuarioDialog } from './delete-usuario.dialog';

describe('DeleteUsuarioDialog', () => {
  let component: DeleteUsuarioDialog;
  let fixture: ComponentFixture<DeleteUsuarioDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUsuarioDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUsuarioDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
