import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountingReportComponent } from './counting-report.component';

describe('CountingReportComponent', () => {
  let component: CountingReportComponent;
  let fixture: ComponentFixture<CountingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
