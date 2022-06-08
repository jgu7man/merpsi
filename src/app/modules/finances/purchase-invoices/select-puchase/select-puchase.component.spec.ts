import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPuchaseComponent } from './select-puchase.component';

describe('SelectPuchaseComponent', () => {
  let component: SelectPuchaseComponent;
  let fixture: ComponentFixture<SelectPuchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPuchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPuchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
