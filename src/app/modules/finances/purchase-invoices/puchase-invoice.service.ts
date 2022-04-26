import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { iInvoice, PurchaseInvoiceModel } from 'src/app/modules/finances/purchase-invoices/pucharce-invoice.model';
import { BehaviorSubject } from 'rxjs';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ProductModel } from '../../inventory/products/products.model';
import { invoiceFooter, ProductInvoiceModel } from '../invoices/invoice.model';
import { TaxesService } from '../taxes/taxes.service';


@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {

  current$ = new BehaviorSubject<PurchaseInvoiceModel | null>(null)
  businessCRF: string = this._cache.getDataKey('eid')!
  public totales: EventEmitter<invoiceFooter> = new EventEmitter();

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    public _taxes: TaxesService

  ) { 
  }

  create( ){
    
    // this.current$.next(new PurchaseInvoiceModel())
  }

  // addProduct(productRef: FireDoc<ProductModel>, cant: number, cost: number) {

  //   if (this.current$.value !== null) {

  //     // this.current$.next({
  //     //   ...this.current$.value,
  //     //   details: [
  //     //     ...this.current$.value.details,
  //     //     new ProductPurchasedModel(productRef)
  //     //   ]
  //     // })
      
  //     const details = this.current$.value.details!
  //     details.push( new ProductInvoiceModel( productRef) )
  //     this.current$.next({
  //       ...this.current$.value,
  //       details
  //     }) 
  //   }
  //   return new ProductInvoiceModel(productRef)

  // }

  deleteConcept(UPC: string){

    if (this.current$.value !== null) {
      // const conceptIndex = this.current$.value.details.findIndex(d => d.UPC === UPC)
      // if (conceptIndex < 0) {throw {message: 'Concepto no encontrado'}}
      
      // const details = this.current$.value.details
      // details. splice(conceptIndex, 1)
      // this.current$.next({
      //   ...this.current$.value,
      //   details
      // }) 

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
    foot.total = (subtotal + foot.shipping + this._taxes.appliedTaxesTotal) - (foot.discount)
    this.updateCurrent('footer', foot)
    return foot
  }


  updateCurrent(
    param: keyof PurchaseInvoiceModel,
    value: PurchaseInvoiceModel[ typeof param ]
  ) {
    if ( this.current$.value !== null ) {
      this.current$.next( {
        ...this.current$.value,
        [param]: value
      })
    }
  }
  
 async findInvoice( invoiceId: string){
   try {
     
     const invoiceResult = await this._afs.doc<iInvoice>(`businesses/${this.businessCRF}/purchases/${invoiceId}`).ref.get()
     return invoiceResult.exists ? invoiceResult : null

   }catch (error: any) {
    Swal.fire( {
      icon: 'error',
      text: error.message
    } )
   return null
   }
 }

  addConcept(concept: ProductModel) {
    if (this.current$.value != null) {
      let details: ProductInvoiceModel[] = this.current$.value.details
      details.push(new ProductInvoiceModel(concept))
      this.updateCurrent('details', details)
    }
  }

  async getChanges(changes: any, concept: any) {
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
    let taxes = foot.taxes
    if (taxes.length > 0) {
      taxes.map(tax => {
        this._taxes.calcTax(tax, foot.subtotal)
      })
    }
    foot.total = (subtotal + foot.shipping + this._taxes.appliedTaxesTotal) - (foot.discount)
    this.updateCurrent('footer', foot)

    this.totales.emit(foot)
    return foot
  }

  getFooter(changes: invoiceFooter) {
    if (this.current$.value != null) {
      let footer = this.current$.value.footer
      let discount = changes.discount
      let shipping = changes.shipping
      footer.total = (footer.subtotal + shipping + this._taxes.appliedTaxesTotal) - discount
      this.updateCurrent('footer', { ...footer, discount: discount, shipping: shipping }
      )
      this.totales.emit(footer)
    }
  }
}

// type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]