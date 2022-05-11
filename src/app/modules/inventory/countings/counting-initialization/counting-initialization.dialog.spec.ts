import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountingInitializationDialog } from './counting-initialization.dialog';

describe('CountingInitializationDialog', () => {
  let component: CountingInitializationDialog;
  let fixture: ComponentFixture<CountingInitializationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountingInitializationDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountingInitializationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
