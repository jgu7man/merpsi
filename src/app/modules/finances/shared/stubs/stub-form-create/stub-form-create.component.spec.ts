import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StubFormCreateComponent } from './stub-form-create.component';

describe('StubFormCreateComponent', () => {
  let component: StubFormCreateComponent;
  let fixture: ComponentFixture<StubFormCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StubFormCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StubFormCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
