import { AppliedTaxModel, TaxModel } from 'src/app/modules/finances/taxes/taxes.model';
import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { TaxesService } from 'src/app/modules/finances/taxes/taxes.service';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesService } from '../../sales-invoices/sales.service';

@Component({
  selector: 'app-tax-amount-crud',
  templateUrl: './tax-amount-crud.component.html',
  styleUrls: ['./tax-amount-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxAmountCrudComponent implements OnInit {

  @Input() amount_base: number = 0
  @Input() typeInvoice = null
  taxCtrl: FormControl = new FormControl( null );
  appliedTax?: AppliedTaxModel

  @Output()  totalTax = new EventEmitter();
  constructor (
    public taxes: TaxesService,
    public purchase: PurchaseInvoiceService,
    public sales: SalesService,
  ) { }

  ngOnInit(): void {
  }

  selectionChanged( event: MatSelectChange ) {
    let tax: TaxModel = event.value
    this.appliedTax = new AppliedTaxModel( tax, this.amount_base );
    this.taxes.applidedTaxes.push( this.appliedTax )
    this.taxCtrl.setValue(null)
    this.totalTax.emit()
  }

  remove(index: number) {
    this.taxes.applidedTaxes.splice(index, 1)
    this.totalTax.emit()

  }

  

}
