import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvoiceSalesComponent } from './create-invoice-sales.component';

describe('CreateInvoiceComponent', () => {
  let component: CreateInvoiceSalesComponent;
  let fixture: ComponentFixture<CreateInvoiceSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvoiceSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvoiceSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
