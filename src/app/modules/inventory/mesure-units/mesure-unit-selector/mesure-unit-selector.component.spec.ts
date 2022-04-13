import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesureUnitSelectorComponent } from './mesure-unit-selector.component';

describe('MesureUnitSelectorComponent', () => {
  let component: MesureUnitSelectorComponent;
  let fixture: ComponentFixture<MesureUnitSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesureUnitSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesureUnitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
