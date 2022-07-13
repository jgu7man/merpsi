import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { CreditNoteService } from '../../credit-note/credit-note.service';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { TaxesService } from '../../taxes/taxes.service';
import { InvoiceFooter } from '../invoice.model';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer-invoice',
  templateUrl: './footer-invoice.component.html',
  styleUrls: ['./footer-invoice.component.scss']
})
export class FooterInvoiceComponent implements OnInit, OnDestroy {

  @Input() invoice: SalesInvoiceModel | null = null
  @Input() document: string | null = null

  formFooter: FormGroup = new FormGroup({
    discount: new FormControl(0),
    shipping: new FormControl(0),
  })


  @Output() getFooter = new EventEmitter();

  constructor(
    public purchase: PurchaseInvoiceService,
    public sales: SalesService,
    public taxes: TaxesService,
    public credit: CreditNoteService,
    public foot: FooterService

  ) {
    
  }
  ngOnDestroy(): void {
    this.foot.currentfoot$.next(null)
  }

  ngOnInit(): void {
    if (this.invoice) {
      this.foot.makeFooter(this.invoice.footer)  
    } else {
      this.foot.currentfoot$.next(new InvoiceFooter())
      this.formFooter.valueChanges.pipe(
        distinctUntilChanged((x, y) =>
          typeof x != 'object' ? x === y : JSON.stringify(x) === JSON.stringify(y)
        ),
        skip(1),
        debounceTime(3000),
      ).subscribe(changes => {
        this.foot.updateFooter(changes)
      })
    }


  }



}
