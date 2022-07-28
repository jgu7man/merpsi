import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StubSelectorComponent } from './stub-selector.component';

describe('StubSelectorComponent', () => {
  let component: StubSelectorComponent;
  let fixture: ComponentFixture<StubSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StubSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StubSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
