import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { txn } from 'src/app/models/firestore.model';
import { SalesInvoiceModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { iInvoiceFooter, invoiceFooter, iProductInvoice, ProductInvoiceModel } from '../invoices/invoice.model';
import { TaxesService } from '../taxes/taxes.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  businessRef = this._dashboard.businessRef
  current$= new BehaviorSubject<SalesInvoiceModel | null> ( null )
  
  businessCRF: string = this._cache.getDataKey('eid')!
  public totales: EventEmitter<iInvoiceFooter> = new EventEmitter();

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    public _taxes: TaxesService,
    private _dashboard: DashboardService

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
      let details: iProductInvoice[] = this.current$.value.details
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
  
  getFooter(changes: iInvoiceFooter) {
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

  saveInvoice() {
  
  }

   async getStokProductByStore(upc: string) {
    let storeP = await this.getStoreStock(upc)
    let ps = storeP.docs[0].data()
    return ps
  }
  getStoreStock(UPC: string) {
    return this._afs.collection<StoreReferenceModel>(`businesses/${this.businessCRF}/products/${UPC}/stores`).ref.get()

  }
  
}
