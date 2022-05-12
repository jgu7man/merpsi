import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountingsComponent } from './countings.component';

describe('CountingsComponent', () => {
  let component: CountingsComponent;
  let fixture: ComponentFixture<CountingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
