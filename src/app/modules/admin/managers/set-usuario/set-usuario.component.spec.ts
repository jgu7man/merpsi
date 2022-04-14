import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUsuarioComponent } from './set-usuario.component';

describe('SetUsuarioComponent', () => {
  let component: SetUsuarioComponent;
  let fixture: ComponentFixture<SetUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
