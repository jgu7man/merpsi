import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { CreditNoteService } from '../../credit-note/credit-note.service';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { AppliedTaxModel } from '../../taxes/taxes.model';
import { TaxesService } from '../../taxes/taxes.service';
import { iInvoiceFooter, InvoiceFooterModel } from '../invoice.model';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer-invoice',
  templateUrl: './footer-invoice.component.html',
  styleUrls: ['./footer-invoice.component.scss']
})
export class FooterInvoiceComponent implements OnInit, OnDestroy {


  @Input() footerCalc: iInvoiceFooter | null = null
  @Input() invoice: SalesInvoiceModel | null = null
  @Input() document: string | null = null

  formFooter: FormGroup = new FormGroup({
    discount: new FormControl(this.footerCalc != null ? this.footerCalc.discount : 0),
    shipping: new FormControl(this.footerCalc != null ? this.footerCalc.shipping : 0),
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
    if ( !this.foot.currentfoot$.value) {
      
        if ( this.invoice ) {
          this.foot.currentfoot$.next(this.invoice.footer)
          this.formFooter.patchValue({ ...this.invoice.footer })
          this.updateTaxes(this.invoice.footer.taxes)
          if ( this.document == 'sale'){
            this.readonlyAll()
        }
        } else {
          this.foot.currentfoot$.next(new InvoiceFooterModel())
        }
    }

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
  readonlyAll() {
    this.formFooter.controls.discount.disable()
    this.formFooter.controls.shipping.disable()
  }
  updateTaxes(taxes: AppliedTaxModel[]) {
    this.taxes.applidedTaxes = taxes
  }

  getTotalTaxes() {
    this.foot.getTotalTaxes()
  }

}
