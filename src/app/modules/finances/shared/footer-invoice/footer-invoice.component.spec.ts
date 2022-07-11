import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterInvoiceComponent } from './footer-invoice.component';

describe('FooterInvoiceComponent', () => {
  let component: FooterInvoiceComponent;
  let fixture: ComponentFixture<FooterInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
