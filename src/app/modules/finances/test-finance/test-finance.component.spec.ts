import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFinanceComponent } from './test-finance.component';

describe('TestFinanceComponent', () => {
  let component: TestFinanceComponent;
  let fixture: ComponentFixture<TestFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFinanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
