import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesureUnitsComponent } from './mesure-units.component';

describe('MesureUnitsComponent', () => {
  let component: MesureUnitsComponent;
  let fixture: ComponentFixture<MesureUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesureUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesureUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
