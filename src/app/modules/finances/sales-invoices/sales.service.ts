import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject } from 'rxjs';
import { SalesInvoiceModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';

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
