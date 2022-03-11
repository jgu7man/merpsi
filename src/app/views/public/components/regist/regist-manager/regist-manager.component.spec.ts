import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistManagerComponent } from './regist-manager.component';

describe('RegistManagerComponent', () => {
  let component: RegistManagerComponent;
  let fixture: ComponentFixture<RegistManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
