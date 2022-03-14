import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSedeComponent } from './set-sede.component';

describe('SetSedeComponent', () => {
  let component: SetSedeComponent;
  let fixture: ComponentFixture<SetSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetSedeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
