import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject } from 'rxjs';
import { ClientModel } from '../models/clients.model';
import { FireDoc, FireRef } from '../models/firestore.model';
import { ProductModel } from '../models/products.model';
import { ProductInvoiceSalesModel, SalesInvoiceModel } from '../models/sales-invoice.model';
import { iSede } from '../models/sede.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  current$= new BehaviorSubject<SalesInvoiceModel | null>( null )

  businessCRF: string = this._cache.getDataKey('eid')!

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
  ) { }

  async findClient(name: string){
    /**autocomplete */
  }

  addProduct(productRef: FireDoc<ProductModel>, cant: number, cost: number, store: FireRef<iSede>) {
  
    if (this.current$.value !== null) {
      const details = this.current$.value.details!

      details.push(new ProductInvoiceSalesModel(productRef, store))
      this.current$.next({
        ...this.current$.value,
        details
      })
    }
  
  }

}
