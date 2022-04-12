import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductModel } from '../models/products.model';
import { iInvoice, PurchaseInvoiceModel } from '../models/pucharce-invoice.model';
import { FireDoc } from '../models/firestore.model';
import { BehaviorSubject } from 'rxjs';
import { DashboardService } from '../modules/dashboard/dashboard.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { ProductInvoiceModel } from '../models/invoice.model';


@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {

  current$ = new BehaviorSubject<PurchaseInvoiceModel | null>(null)
  businessCRF: string = this._cache.getDataKey('eid')!
  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService
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
    }
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
    if (this.current$.value !== null) {
      let details: ProductInvoiceModel[] = this.current$.value.details
      details.push(new ProductInvoiceModel(concept))
      this.updateCurrent('details', details)
    }
  }
}

// type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];