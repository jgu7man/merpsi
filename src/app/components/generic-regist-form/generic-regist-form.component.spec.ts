import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRegistFormComponent } from './generic-regist-form.component';

describe('GenericRegistFormComponent', () => {
  let component: GenericRegistFormComponent;
  let fixture: ComponentFixture<GenericRegistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericRegistFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericRegistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
