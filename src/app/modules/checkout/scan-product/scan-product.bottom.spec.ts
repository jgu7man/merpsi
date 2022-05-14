import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanProductBottom } from './scan-product.bottom';

describe('ScanProductComponent', () => {
  let component: ScanProductBottom;
  let fixture: ComponentFixture<ScanProductBottom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanProductBottom ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanProductBottom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
