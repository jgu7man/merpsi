import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { from, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { PurchaseInvoiceModel } from '../../purchase-invoices/pucharce-invoice.model';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { TaxesService } from '../../taxes/taxes.service';
import { invoiceFooter } from '../invoice.model';

@Component({
  selector: 'app-footer-invoice',
  templateUrl: './footer-invoice.component.html',
  styleUrls: ['./footer-invoice.component.scss']
})
export class FooterInvoiceComponent implements OnInit {


  @Input() footerCalc: invoiceFooter | null= null

  totalesObs: Observable<invoiceFooter> = of(this.footerCalc!)

  formFooter: FormGroup = new FormGroup({
    subtotal: new FormControl(this.footerCalc != null ? this.footerCalc.subtotal : 0),
    discount: new FormControl(this.footerCalc != null ? this.footerCalc.discount : 0),
    taxes: new FormControl(),
    shipping: new FormControl(this.footerCalc != null ? this.footerCalc.shipping : 0),
    total: new FormControl(this.footerCalc != null ? this.footerCalc.total : 0),
  })


  @Output() getFooter = new EventEmitter();

  constructor(
    public purchase: PurchaseInvoiceService,
    public sales: SalesService,
    private _taxes: TaxesService
  ) {
    this.disableForm()
  }

  ngOnInit(): void {
    this.sales.totales.subscribe(data => {
      this.setTotales(data);
    })
    this.purchase.totales.subscribe(data => {
      this.setTotales(data);
    })
    this.formFooter.valueChanges.pipe(
      distinctUntilChanged((x, y) =>
        typeof x != 'object' ? x === y : JSON.stringify(x) === JSON.stringify(y)
      ),
      skip(1),
      debounceTime(3000),
    ).subscribe(changes => {
      this.getFooter.emit(changes)
    })
  }
  setTotales(data: invoiceFooter) {
    this.formFooter.patchValue({
      subtotal: data.subtotal,
      total: data.total
    })
  }
  get getTotal(){
    return this.footerCalc!= null ? this.footerCalc.total : 0
  }
  disableForm() {
    this.formFooter.controls.subtotal.disable()
    this.formFooter.controls.total.disable()
  }

  setFooter(invoice: PurchaseInvoiceModel | SalesInvoiceModel) {
     this.formFooter.patchValue({
        subtotal: invoice.footer.subtotal,
        total: invoice.footer.total
    })
  }

  getTotalTaxes(total: number){
    let footer: invoiceFooter = this.purchase.current$.value != null ? 
    this.purchase.current$.value.footer : this.sales.current$.value!.footer 
    footer.total = footer.total + total
    footer.taxes = this._taxes.applidedTaxes
    this.formFooter.patchValue({
      total: footer.total
    })
    console.log(footer)


  }

}
