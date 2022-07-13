import { Injectable } from '@angular/core';
import { PurchaseInvoiceService } from '../purchase-invoices/puchase-invoice.service';
import { SalesService } from '../sales-invoices/sales.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    public purchase: PurchaseInvoiceService,
    public sales: SalesService
  ) { }

 
}
