import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app'
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { txn } from 'src/app/models/firestore.model';
import { SalesInvoiceModel, SalesInvoiceReadingModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentProductService } from '../../inventory/product-single/current-product.service';
import { ProductEventModel, ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { CreditNoteModel, iCreditNote } from '../credit-note/creditNote.model';
import { FooterService } from '../invoices/footer-invoice/footer.service';
import { InvoiceConceptService } from '../invoices/invoice-concept/invoice-concept.service';
import { Invoice, InvoiceFooter, ProductInvoiceModel } from '../invoices/invoice.model';
//import { iInvoiceFooter, iProductInvoice, ProductInvoiceModel } from '../invoices/invoice.model';
import { PurchaseInvoiceModel } from '../purchase-invoices/pucharce-invoice.model';
import { iStub } from '../stubs-invoice/stub.model';
import { StubService } from '../stubs-invoice/stub.service';
import { TaxesService } from '../taxes/taxes.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {


  businessRef = this._dashboard.businessRef
  current$ = new BehaviorSubject<SalesInvoiceModel | null>(null)
  stubsList$ = new BehaviorSubject<iStub[] | null>(null)
  businessCRF: string = this._cache.getDataKey('eid')!
  stubList$ = new BehaviorSubject<iStub[]>([])
  stubSelect$ = new BehaviorSubject<iStub | null>(null)
  public totales: EventEmitter<InvoiceFooter> = new EventEmitter();

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    public _taxes: TaxesService,
    private _dashboard: DashboardService,
    private _alert: MxAlert,
    private foot: FooterService,
    public conceptInvoice: InvoiceConceptService,
    public stub: StubService,

  ) {

  }

  addConcept(concept: ProductModel, stock: number, store: string) {
    if (this.conceptInvoice.details$.value != null) {
      let details: ProductInvoiceModel[] = this.conceptInvoice.details$.value
      let det = new ProductInvoiceModel(concept, store)
      det.stock = stock
      details.push(det)
      this.conceptInvoice.details$.next(details)
    }
  }

  saveInvoice(invoice: SalesInvoiceModel) {
    try {
      let businessRef = `businesses/${this._dashboard.CRF}`
      const invoiceRef = this._afs.doc<SalesInvoiceModel>(`${businessRef}/sales/${invoice.invoiceId}`).ref
      invoiceRef.set({ ...invoice })

      let details: Invoice.concept[] = invoice.details
      details.forEach(async det => {
        let productRef = this._afs.doc(`${businessRef}/products/${det.product.UPC}`).ref
        await firebase.firestore().runTransaction(async transaction => {
          if (det.store == null) throw { message: 'No se encuentra la store del producto: ' + det.product.UPC }
          let store_Id = det.store
          const storeRef = productRef.collection('stores').doc(store_Id)
          let productStore = (await transaction.get(storeRef)).data()

          if (!productStore) {
            productStore = new StoreReferenceModel(store_Id, det.product.UPC, det.unit_cost)
          }
          productStore.stock = productStore.stock - det.cant!

          await transaction.set(storeRef, { ...productStore }, { merge: true })
          const evento = new ProductEventModel(
            'sale',
            this._dashboard.managerRef,
            invoiceRef
          )
          this._afs.collection(`${businessRef}/products/${det.product.UPC}/history`)
            .doc(`${new Date().getTime()}`)
            .set({ ...evento })
        })

            /* Se actualiza el index current en el talonario seleccionado */
            const stub = this.stubSelect$.value
            if (!stub) throw { message: 'No se ha seleccionado un talonario'}
            stub.currentIndex = stub.currentIndex + 1
              this.stub.update(stub)
      })

      /* Se actualiza el index current en el talonario seleccionado */
    const stub = this.stubSelect$.value
    if (!stub) throw { message: ' No existe el talonario' }
    stub.currentIndex = stub.currentIndex + 1
      this.stub.update(stub)
    
    this._alert.notify('la factura ha sido guardado con exito!')

    } catch (error) {
      // this._alert.error('ha ocurrido un error al crear la factura', error)
      console.error(error);
    }
  }


  async getStokProductByStore(product: ProductModel[]) {
    let stores: StoreReferenceModel[] = []
    product.forEach(async p => {
      let storesResult = await this.getStoreStock(p.UPC)
      if (storesResult.docs.length > 0) {
        storesResult.docs.forEach(docs =>
          stores.push(docs.data())
        )
      }
    })
    console.log(stores);
    
    return stores
  }
  getStoreStock(UPC: string) {
    let storeP = this._afs.collection<StoreReferenceModel>(`businesses/${this.businessCRF}/products/${UPC}/stores`).ref.get()
    // console.log(storeP)
    return storeP

  }

  listInvoice(): Observable<SalesInvoiceReadingModel[]> {
    return this._afs.collection<SalesInvoiceModel>(`businesses/${this.businessCRF}/sales`).valueChanges()
      .pipe(
        map(result => {
          const sales: SalesInvoiceModel[] = [];
          let invoiceReadingList:SalesInvoiceReadingModel[] = []
          result.map(s => {
            let invoiceReading=  new SalesInvoiceReadingModel(s,this._cache.getDataKey( 'eid' )! )
            return invoiceReadingList.push(invoiceReading);
          });
          return invoiceReadingList;
        }),
        catchError(error => {
          console.error(error);
          this._alert.error('No se logró cargar la lista del factura de ventas', error);
          return of([]);
        })
      );
  }

  

   async searchAnnulledCreditNotes(id: string){
    const notesRef = await this.getnotesByidAndTypeConcept(id)
    let notes_result = notesRef.docs.map((doc) => {
      return doc.data()
    })
    if (notes_result.length > 0) {
      return true
    }else {
      return false
    }

  }


  async getnotesByid(id: string) {
    return await this._afs.collection<iCreditNote>(`businesses/${this.businessCRF}/credit_notes`).ref.where('invoiceId', '==', id).get()
  }
  
   async getnotesByidAndTypeConcept(id: string) {
    let ref = this._afs.collection<iCreditNote>(`businesses/${this.businessCRF}/credit_notes`).ref
    return await ref.where('invoiceId', '==', id).where('concept', '==' , 'anulacion').get()
  }
}
