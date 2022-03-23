import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsCrudComponent } from './chips-crud.component';

describe('ChipsCrudComponent', () => {
  let component: ChipsCrudComponent;
  let fixture: ComponentFixture<ChipsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipsCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
