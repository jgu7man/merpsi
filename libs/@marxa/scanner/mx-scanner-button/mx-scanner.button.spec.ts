import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MxScannerButton } from './mx-scanner.button';

describe('MxScannerButtonButton', () => {
  let component: MxScannerButton;
  let fixture: ComponentFixture<MxScannerButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MxScannerButton ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MxScannerButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
