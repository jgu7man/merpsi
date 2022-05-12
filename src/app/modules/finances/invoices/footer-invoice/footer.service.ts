import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject } from 'rxjs';
import { TaxesService } from '../../taxes/taxes.service';
import { iInvoiceFooter } from '../invoice.model';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  currentfoot$ = new BehaviorSubject<iInvoiceFooter | null>(null)
  
  constructor(
    private _alert: MxAlert,
    private _taxes: TaxesService
    ) { }
    
    updateFooter(changes: any) {
      try {
        if ( !this.currentfoot$.value ) throw {message: "no existe el footer"}
        const discount = changes.discount
        const shipping =  changes.shipping
        const subtotal = this.currentfoot$.value.subtotal
    const taxes = this.currentfoot$.value.totalTaxes
    this.currentfoot$.value.total = ( shipping + subtotal + taxes) - discount
    
  } catch (error: any) {
    if ('message' in error) {
      this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
    
  }
  getTotalTaxes() {
    try {
      if (!this.currentfoot$.value) throw { message: "no existe el footer" }
      let footer = this.currentfoot$.value
      footer.total = (footer.subtotal + this._taxes.appliedTaxesTotal + footer.shipping) - footer.discount
      footer.taxes = this._taxes.applidedTaxes
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }
}
