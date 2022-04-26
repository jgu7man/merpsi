import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject } from 'rxjs';
import { SalesInvoiceModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { ProductModel } from '../../inventory/products/products.model';
import { invoiceFooter, ProductInvoiceModel } from '../invoices/invoice.model';
import { TaxesService } from '../taxes/taxes.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  current$= new BehaviorSubject<SalesInvoiceModel | null> ( null )

  businessCRF: string = this._cache.getDataKey('eid')!
  public totales: EventEmitter<invoiceFooter> = new EventEmitter();

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    public _taxes: TaxesService
  ) { }

  updateCurrent(
    param: keyof SalesInvoiceModel,
    value: SalesInvoiceModel[ typeof param ]
  ) {
    if ( this.current$.value !== null ) {
      this.current$.next( {
        ...this.current$.value,
        [param]: value
      })
    }
  }

  deleteConcept(UPC: string){

    if (this.current$.value !== null) {
      this.current$.next({
        ...this.current$.value,
        details: this.current$.value.details!.filter( c => c.UPC !== UPC)
      })

      this.current$.next({
        ...this.current$.value,
        details: this.current$.value.details!.filter( c => c.UPC !== UPC)
      })
      let foot = this.calcFooter()
      this.totales.emit(foot)
    }
  }
  
  calcFooter(){
    let details = this.current$.value!.details
    let subtotal = 0
    details.map(d => {
        subtotal += d.amount
    })
    let foot = this.current$.value!.footer
    foot.subtotal = subtotal
    foot.total = (subtotal + foot.shipping + this._taxes.appliedTaxesTotal ) - (foot.discount) 
    this.updateCurrent('footer', foot)
    return foot
  }
  addConcept(concept:ProductModel){
    console.log(concept)
    if (this.current$.value != null){
      let details: ProductInvoiceModel[] = this.current$.value.details
      details.push(new ProductInvoiceModel(concept))
      this.updateCurrent('details', details)
    }

  }

  getChanges(changes: any, concept: any) {
    let details = this.current$.value!.details
    let subtotal = 0
    details = details.map(d => {

      let details
      if (d.UPC === concept!.UPC) {
        changes.amount = changes.cant * changes.unit_cost
        details = {
          ...d,
          ...changes
        }
        subtotal += changes.amount
      } else {
        details = d
        subtotal += d.amount
      }
      return details
    }
    )
    this.updateCurrent('details', details)
    let foot = this.current$.value!.footer
    foot.subtotal = subtotal
    foot.total = (subtotal + foot.shipping) - (foot.discount)
    this.updateCurrent('footer', foot)

    this.totales.emit(foot)
    return foot
  }

  getFooter(changes: invoiceFooter) {
    if (this.current$.value != null) {
      let footer = this.current$.value.footer
      let discount = changes.discount
      let shipping = changes.shipping
      footer.total = (footer.subtotal + shipping) - discount
      this.updateCurrent('footer', { ...footer, discount: discount, shipping: shipping }
      )
      this.totales.emit(footer)
    }
  }

}
