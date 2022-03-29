import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductModel } from '../models/products.model';
import { ProductPurchasedModel, PurchaseInvoiceModel } from '../models/pucharce-invoice.model';
import { FireDoc } from '../models/firestore.model';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {

  current$ = new BehaviorSubject<PurchaseInvoiceModel | null>(null)

  constructor(
    private _afs: AngularFirestore
  ) { }

  create( ){
    
    this.current$.next(new PurchaseInvoiceModel())
  }

  addProduct(productRef: FireDoc<ProductModel>, cant: number, cost: number) {

    if (this.current$.value !== null) {

      // this.current$.next({
      //   ...this.current$.value,
      //   details: [
      //     ...this.current$.value.details,
      //     new ProductPurchasedModel(productRef)
      //   ]
      // })
      
      const details = this.current$.value.details
      details.push( new ProductPurchasedModel( productRef) )
      this.current$.next({
        ...this.current$.value,
        details
      }) 
    }
    return new ProductPurchasedModel(productRef)

  }

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
        details: this.current$.value.details.filter( c => c.UPC !== UPC)
      })
    }
  }

  

}
