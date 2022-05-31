import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject } from 'rxjs';
import { TaxesService } from '../../taxes/taxes.service';
import { Invoice, InvoiceFooter } from '../invoice.model';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  currentfoot$ = new BehaviorSubject<InvoiceFooter | null>(null)
  currentfoot_invoice$ = new BehaviorSubject<Invoice.footer | null>(null)
  
  constructor(
    private _alert: MxAlert,
    private _taxes: TaxesService
    ) { }
    
    updateFooter(changes: any) {
      try {
        console.log('cambie');
        if ( !this.currentfoot$.value ) throw {message: "no existe el footer"}
        let foot = this.currentfoot$.value
        foot.discount = changes.discount
        foot.shipping =  changes.shipping
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

  // updateCurrent(
  //   param: keyof InvoiceFooter,
  //   value: InvoiceFooter[typeof param]
  // ) {
  //   if (this.currentfoot$.value !== null) {
  //     this.currentfoot$.next({
  //       ...this.currentfoot$.value.data,
  //       [param]: value
  //     })
  //   }
  // }
  // getTotalTaxes() {
  //   try {
  //     if (!this.currentfoot$.value) throw { message: "no existe el footer" }
  //     let footer = this.currentfoot$.value
  //     footer.total = (footer.subtotal + this._taxes.appliedTaxesTotal + footer.shipping) - footer.discount
  //     footer.taxes = this._taxes.applidedTaxes
  //   } catch (error: any) {
  //     if ('message' in error) {
  //       this._alert.error(error.message, error)
  //     } else {
  //       this._alert.error('mensaje de error', error)
  //     }
  //     return console.error(error)
  //   }
  // }
}
