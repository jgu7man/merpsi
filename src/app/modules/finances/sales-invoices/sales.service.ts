import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatCheckboxChange } from '@angular/material/checkbox';
import firebase from 'firebase/app'
import { MxAlert, MxCache } from '@marxa/devkit';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ConceptAvailability, SalesInvoiceModel, SalesInvoiceReadingModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { DatabasePathsService } from 'src/app/services/database-paths.service';
import { PersonalService } from '../../admin/managers/personal.service';
import { ClientCreationModel } from '../../clients/clients.model';
import { ProductEventModel, ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { iCreditNote, ProductNoteModel } from '../credit-note/creditNote.model';
import { FooterService } from '../shared/footer-invoice/footer.service';
import { DetailsConceptService } from '../shared/invoice-details/invoice-details.service';
import { Invoice, InvoiceFooter, ProductInvoiceModel } from '../shared/invoice.model';
import { iStub } from '../shared/stubs/stub.model';
import { StubService } from '../shared/stubs/stub.service';
import { TaxesService } from '../shared/taxes/taxes.service';

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
  products: ProductInvoiceModel[] = []
  infoAditional: Invoice.additionalInfo | null = null

  public totales: EventEmitter<InvoiceFooter> = new EventEmitter();
  client: ClientCreationModel | null = null;

  constructor(
    public taxes: TaxesService,
    public conceptInvoice: DetailsConceptService,
    public stub: StubService,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    private _alert: MxAlert,
    private _manager: PersonalService,
    private _footer: FooterService,
    private _path: DatabasePathsService


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

  getValue(client_: ClientCreationModel) {
    this.client = client_
  }

  saveInvoice() {
    try {
    if (!this.infoAditional) throw { message: 'No se obtiene la Información Adicional' }
    if (!this.client) throw { message: 'No existe el cliente' }
    if (!this.stubSelect$.value) throw { message: 'No existe el talonario' }
    if (!this._manager.current) throw { message: 'No se ha iniciado la sesion' }
    if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }


    const client: Invoice.client = {
      id: this.client.id!,
      name: this.client.name!,
      CRF: this.client.CRF!
    }

    const manager: Invoice.manager = {
      id: this._manager.current.uid!,
      name: this._manager.current.name,
      ref: this._manager.managerRef
    }

    const invoice = new SalesInvoiceModel(
      this.stubSelect$.value.prefixIndexCurrent,
      client,
      this.infoAditional.seller,
      this.infoAditional.currency,
      this.infoAditional.payment_method,
      manager,
      this.conceptInvoice.details$.value,
      this._footer.currentfoot$.value.getdata()
    )
      const invoiceRef = this._afs.doc<SalesInvoiceModel>(`${this._path.salesRef}/${invoice.invoiceId}`).ref
      invoiceRef.set({ ...invoice })

      let details: Invoice.concept[] = invoice.details
      details.forEach(async det => {
        let productRef = this._afs.doc(`${this._path.productsRef}/${det.product.UPC}`).ref
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
          this._afs.collection(`${this._path.productsRef}/${det.product.UPC}/history`)
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
    let storeP = this._afs.collection<StoreReferenceModel>(`${this._path.productsRef}/${UPC}/stores`).ref.get()
    return storeP

  }

  listInvoice(): Observable<SalesInvoiceReadingModel[]> {
    return this._afs.collection<SalesInvoiceModel>(`${this._path.salesRef}`).valueChanges()
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
    return await this._afs.collection<iCreditNote>(`${this._path.creditNoteRef}`).ref.where('invoiceId', '==', id).get()
  }
  
   async getnotesByidAndTypeConcept(id: string) {
    let ref = this._afs.collection<iCreditNote>(`${this._path.creditNoteRef}`).ref
    return await ref.where('invoiceId', '==', id).where('concept', '==' , 'anulacion').get()
  }

  
  addProduct(event: MatCheckboxChange, concept: ConceptAvailability) {
    try {
      if (event.checked) {
        let product = new ProductNoteModel(concept.cant, concept.unit_price, concept.store, concept.concept)
        this.products.push(product);
      } else {
        this.products = this.products.filter(c => c.product.UPC != concept.concept.UPC)
      }
    } catch (error) {
      console.error(error)
    }
  }

}
