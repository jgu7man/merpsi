import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesureUnitFormComponent } from './mesure-unit-form.component';

describe('MesureUnitFormComponent', () => {
  let component: MesureUnitFormComponent;
  let fixture: ComponentFixture<MesureUnitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesureUnitFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesureUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
