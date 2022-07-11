import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject } from 'rxjs';
import { TaxesService } from '../../taxes/taxes.service';
import { Invoice, InvoiceFooter, ProductInvoiceModel } from '../invoice.model';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  currentfoot$ = new BehaviorSubject<InvoiceFooter | null>(null)
  currentfoot_invoice$ = new BehaviorSubject<Invoice.footer | null>(null)
  
  constructor(
    private _alert: MxAlert,
    private _taxes: TaxesService,
    ) { }
    
    updateFooter(changes: any) {
      try {
        console.log('cambie');
        if ( !this.currentfoot$.value ) throw {message: "no existe el footer"}
        let foot = this.currentfoot$.value
        foot.discount = changes.discount
        foot.shipping =  changes.shipping
        console.log(foot);
        
        this.currentfoot$.next(foot)
  } catch (error: any) {
    if ('message' in error) {
      this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
    
  }

  getsubtotal( details: ProductInvoiceModel[] ): number {
    let subtotal = details.reduce((subtotal, det) => subtotal + det.amount, 0)
    return subtotal
  }

  get recalculateTaxes() {
    if (!this.currentfoot$.value) throw { message: ' No existe el footer' }
    let subtotal = this.currentfoot$.value.subtotal
    let taxes = this._taxes.applidedTaxes
    taxes.map(tax => {
      this._taxes.calcTax(tax, subtotal)
    })
    return this._taxes.applidedTaxes
  }

  recalculateTaxesCurrentFoot(details: ProductInvoiceModel[]) {
    if (!this.currentfoot$.value) throw { message: ' No existe el footer' }
    let foot = this.currentfoot$.value
    foot.subtotal = this.getsubtotal(details)
      foot.taxes = this.recalculateTaxes
      this.currentfoot$.next(foot)
  }
  
}
