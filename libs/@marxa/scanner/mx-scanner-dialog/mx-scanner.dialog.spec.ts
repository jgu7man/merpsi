import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MxScannerDialog } from './mx-scanner.dialog';

describe('MxScannerDialog', () => {
  let component: MxScannerDialog;
  let fixture: ComponentFixture<MxScannerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MxScannerDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MxScannerDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
