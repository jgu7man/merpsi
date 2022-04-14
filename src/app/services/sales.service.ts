import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject } from 'rxjs';
import { ClientModel } from '../models/clients.model';
import { FireDoc, FireRef } from '../models/firestore.model';
import { ProductModel } from '../models/products.model';
import { SalesInvoiceModel } from '../models/sales-invoice.model';
import { iSede } from '../models/sede.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  current$= new BehaviorSubject<SalesInvoiceModel | null> ( null )

  businessCRF: string = this._cache.getDataKey('eid')!

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
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
    console.log(this.current$.value)
  }

  deleteConcept(UPC: string){

    if (this.current$.value !== null) {
      this.current$.next({
        ...this.current$.value,
        details: this.current$.value.details!.filter( c => c.UPC !== UPC)
      })
    }
  }
  
  

}
