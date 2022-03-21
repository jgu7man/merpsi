import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MxScannerComponent } from './mx-scanner.component';

describe('ScannerComponent', () => {
  let component: MxScannerComponent;
  let fixture: ComponentFixture<MxScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MxScannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MxScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
