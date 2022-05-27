import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app'
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { txn } from 'src/app/models/firestore.model';
import { SalesInvoiceModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentProductService } from '../../inventory/product-single/current-product.service';
import { ProductEventModel, ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { FooterService } from '../invoices/footer-invoice/footer.service';
import { InvoiceConceptService } from '../invoices/invoice-concept/invoice-concept.service';
import { InvoiceFooter, ProductInvoiceModel } from '../invoices/invoice.model';
//import { iInvoiceFooter, iProductInvoice, ProductInvoiceModel } from '../invoices/invoice.model';
import { PurchaseInvoiceModel } from '../purchase-invoices/pucharce-invoice.model';
import { iStub } from '../stubs-invoice/stub.model';
import { TaxesService } from '../taxes/taxes.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  businessRef = this._dashboard.businessRef
  current$ = new BehaviorSubject<SalesInvoiceModel | null>(null)
  stubsList$ = new BehaviorSubject<iStub [] | null>(null)
  businessCRF: string = this._cache.getDataKey('eid')!
  stubList$= new BehaviorSubject<iStub[] >([])
  stubSelect$= new BehaviorSubject<iStub | null>(null)
  public totales: EventEmitter<InvoiceFooter> = new EventEmitter();
  
  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    public _taxes: TaxesService,
    private _dashboard: DashboardService,
    private _alert: MxAlert,
    private foot: FooterService,
    public conceptInvoice: InvoiceConceptService
  ) {

  }

    updateCurrent(
      param: keyof SalesInvoiceModel,
    value: SalesInvoiceModel[ typeof param ]
  ) {
    if (this.current$.value !== null) {
      this.current$.next({
        ...this.current$.value,
        [param]: value
      })
    }
    console.log('actualice current')
  }

  deleteConcept(UPC: string) {

    if (this.current$.value !== null) {
      this.current$.next({
        ...this.current$.value,
        details: this.current$.value.details!.filter(c => c.product.UPC !== UPC)
      })

      this.current$.next({
        ...this.current$.value,
        details: this.current$.value.details!.filter(c => c.product.UPC !== UPC)
      })
      let foot = this.calcFooter()
      //this.totales.emit(foot)
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
    //foot.total = (subtotal + foot.shipping + this._taxes.appliedTaxesTotal ) - (foot.discount)
    this.updateCurrent('footer', foot)
    return foot
  }
  // addConcept(concept: ProductModel, store: string, stock: number) {
  //   console.log(concept)
  //   // if (this.current$.value != null) {
  // let details: iProductInvoice[] = this.current$.value.details
   //details.push(new ProductInvoiceModel(concept, store, stock))
    // this.updateCurrent('details', details)
  //   // }
  // }

  addConcept(concept: ProductModel, stock: number) {
    if (this.conceptInvoice.details$.value != null) {
      let details: ProductInvoiceModel[] = this.conceptInvoice.details$.value
      let det = new ProductInvoiceModel(concept)
      det.stock=stock      
      details.push(new ProductInvoiceModel(concept))
      this.conceptInvoice.details$.next(details)
    }
  }

  getChanges(changes: any, concept: any) {
    if (changes && concept) {

      let details = this.current$.value!.details
      let subtotal = 0
      details = details.map(d => {
        let details
        if (d.product.UPC === concept!.UPC) {
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
     // foot.total = (subtotal + foot.shipping + this._taxes.appliedTaxesTotal) - (foot.discount)
      this.updateCurrent('footer', foot)

     // this.foot.currentfoot$.next(foot)
      // this.totales.emit(foot)
    }
  }

  getFooter(changes: InvoiceFooter) {
    if (this.current$.value != null) {
      let footer = this.current$.value.footer
      let discount = changes.discount
      let shipping = changes.shipping
    //  footer.total = (footer.subtotal + shipping) - discount
      this.updateCurrent('footer', { ...footer, discount: discount, shipping: shipping }
      )
     // this.foot.currentfoot$.next(footer)

      // this.totales.emit(footer)
    }
  }

  saveInvoice( invoice: SalesInvoiceModel ) {
    try {
   /* let businessRef = `businesses/${this._dashboard.CRF}`
    if (this.current$.value){
      const invoiceRef = this._afs.doc<SalesInvoiceModel>(`${businessRef}/sale/${this.current$.value.invoiceId}`).ref
      invoiceRef.set({...invoice})

      let details: ProductInvoiceModel[] = this.current$.value.details
      details.forEach(async det =>{
        let productRef= this._afs.doc(`${businessRef}/products/${det.UPC}`).ref
        await firebase.firestore().runTransaction(async transaction => {
          let store_Id = det.store
          const storeRef = productRef.collection('stores').doc(store_Id)
          let productStore = (await transaction.get(storeRef)).data()

          if (!productStore) {
          productStore  = new StoreReferenceModel(store_Id,det.UPC,det.unit_cost)
          }
          productStore.stock = productStore.stock - det.cant

          await transaction.set(storeRef,{...productStore},{merge: true})
          const evento = new  ProductEventModel(
            'sale',
            this._dashboard.managerRef,
            invoiceRef
            )
            this._afs.collection(`${businessRef}/products/${det.UPC}/history`)
              .doc(`${new Date().getTime()}`)
              .set({ ...evento })
          })
        })
      }*/
    } catch (error) {
      // this._alert.error('ha ocurrido un error al crear la factura', error)
      console.error(error);
    }
  }


   async getStokProductByStore(product: ProductModel[]) {
     let stores:StoreReferenceModel[] = []
     product.forEach( async p =>{
       let storesResult = await this.getStoreStock(p.UPC)
       if (storesResult.docs.length > 0){
         storesResult.docs.forEach(docs =>
           stores.push(docs.data())
         )
       }
     })

    return stores
  }
  getStoreStock(UPC: string) {
    let storeP = this._afs.collection<StoreReferenceModel>(`businesses/${this.businessCRF}/products/${UPC}/stores`).ref.get()
    // console.log(storeP)
    return storeP

  }

  listInvoice(): Observable<SalesInvoiceModel[]> {
    return this._afs.collection<SalesInvoiceModel>(`businesses/${this._dashboard.CRF}/sale`).valueChanges()
      .pipe(
        map(result => {
          const sales: SalesInvoiceModel[] = [];
          result.forEach(s => {
            sales.push(s);
          });
          console.log(sales);

          return sales;
        }),
        catchError(error => {
          console.error(error);
          this._alert.error('No se logró cargar la lista del personal', error);
          return of([]);
        })
      );
  }
}
