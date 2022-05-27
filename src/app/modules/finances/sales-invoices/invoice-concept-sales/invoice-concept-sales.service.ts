import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject } from 'rxjs';
import { FooterService } from '../../invoices/footer-invoice/footer.service';
import { ProductInvoiceModel } from '../../invoices/invoice.model';
import { TaxesService } from '../../taxes/taxes.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceConceptSalesService {
  details$ = new BehaviorSubject<ProductInvoiceModel[]>([])
  constructor(
    private _footer: FooterService,
    private _alert: MxAlert,
    private _taxes: TaxesService
  ) { }
}
