import { AppliedTaxModel, TaxModel } from 'src/app/modules/finances/taxes/taxes.model';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TaxesService } from 'src/app/modules/finances/taxes/taxes.service';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-tax-amount-crud',
  templateUrl: './tax-amount-crud.component.html',
  styleUrls: ['./tax-amount-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxAmountCrudComponent implements OnInit {

  @Input() amount_base: number = 0
  taxCtrl: FormControl = new FormControl( null );
  appliedTax?: AppliedTaxModel

  constructor (
    public taxes: TaxesService
  ) { }

  ngOnInit(): void {
  }

  selectionChanged( event: MatSelectChange ) {
    let tax: TaxModel = event.value
    this.appliedTax = new AppliedTaxModel( tax, this.amount_base );
    this.taxes.applidedTaxes.push( this.appliedTax )
    this.taxCtrl.setValue(null)
  }

  remove(index: number) {
    this.taxes.applidedTaxes.splice(index, 1)
  }

}
