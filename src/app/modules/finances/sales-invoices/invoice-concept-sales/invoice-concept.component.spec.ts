import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceConceptSalesComponent } from './invoice-concept-sales.component';

describe('AddProductComponent', () => {
  let component: InvoiceConceptSalesComponent;
  let fixture: ComponentFixture<InvoiceConceptSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceConceptSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceConceptSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
