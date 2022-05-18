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

  // addConcept(concept: ProductModel) {
  //   if (this.purchase.current$.value || this.sales.current$.value) {
  //     let details: ProductInvoiceModel[] = this.purchase.current$.value ? 
  //     this.purchase.current$.value.details 
  //     : this.sales.current$.value!.details
  //     details.push(new ProductInvoiceModel(concept))
  //     this.purchase.current$.value ? this.purchase.updateCurrent('details', details) : this.sales.updateCurrent('details', details)
  //   }
  // }
}
