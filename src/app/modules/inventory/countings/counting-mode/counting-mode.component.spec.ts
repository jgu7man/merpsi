import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountingModeComponent } from './counting-mode.component';

describe('CountingModeComponent', () => {
  let component: CountingModeComponent;
  let fixture: ComponentFixture<CountingModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountingModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
