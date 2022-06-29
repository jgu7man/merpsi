import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { iPurchaseInvoice, PurchaseInvoiceModel } from 'src/app/modules/finances/purchase-invoices/pucharce-invoice.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ProductEventModel, ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { Invoice, InvoiceFooter, ProductInvoiceModel } from '../invoices/invoice.model';
import { TaxesService } from '../taxes/taxes.service';
import firebase from 'firebase/app'
import { FooterService } from '../invoices/footer-invoice/footer.service';
import { InvoiceConceptService } from '../invoices/invoice-concept/invoice-concept.service';
import { catchError, map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {

  businessCRF: string = this._cache.getDataKey('eid')!
  public totales: EventEmitter<InvoiceFooter> = new EventEmitter();
  invoiceId: string = ''


  constructor(
    public _taxes: TaxesService,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    public footer: FooterService,
    public conceptInvoice: InvoiceConceptService
  ) {
  }

  listPurchases(): Observable<PurchaseInvoiceModel[]> {
    return this._afs.collection<PurchaseInvoiceModel>(`businesses/${this.businessCRF}/purchases/`).valueChanges()
      .pipe(
        map(result => {
          const purchases: PurchaseInvoiceModel[] = []
          result.forEach(p => {
            purchases.push(p);
          })
          return purchases
        }),
        catchError(error => {
          console.error(error);
          Swal.fire('No se logró cargar la lista del factura de compras', error);
          return of([]);
        })
      )
  }

  deleteConcept(UPC: string) {

    if (this.conceptInvoice.details$.value !== null) {
      let details = this.conceptInvoice.details$.value.filter(c => c.product.UPC !== UPC)
      this.conceptInvoice.details$.next({
        ...details
      })
      this.calcFooter()
      //this.totales.emit(foot)
    }
  }

  calcFooter() {
    if (!this.conceptInvoice.details$.value) throw { message: ' No existe detalles' }
    if (!this.footer.currentfoot$.value) throw { message: ' No existe footer' }
    let details = this.conceptInvoice.details$.value
    let subtotal = 0
    details.map(d => {
      subtotal += d.amount
    })
    let foot = this.footer.currentfoot$.value
    foot.subtotal = subtotal
    this.footer.currentfoot$.next(foot)
    //foot.total = (subtotal + foot.shipping + this._taxes.appliedTaxesTotal) - (foot.discount)
    //this.updateCurrent('footer', foot)
    return foot
  }

  async findInvoice(invoiceId: string) {
    try {
      this.invoiceId = invoiceId
      const invoiceResult = await this._afs.doc<iPurchaseInvoice>(`businesses/${this.businessCRF}/purchases/${invoiceId}`).ref.get()
      return invoiceResult.exists ? invoiceResult : null

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        text: error.message
      })
      return null
    }
  }

  addConcept(concept: ProductModel) {
    if (this.conceptInvoice.details$.value != null) {
      let details: ProductInvoiceModel[] = this.conceptInvoice.details$.value
      const det = new ProductInvoiceModel(concept, null)
      details.push(det)
      this.conceptInvoice.details$.next(details)
    }
  }

  async getChanges(changes: any, concept: any) {
    let details = this.conceptInvoice.details$.value
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
    this.conceptInvoice.details$.next(details)
    //await this.updateCurrent('details', details)
    if (!this.footer.currentfoot$.value) throw { message: ' No existe el footer' }
    let foot = this.footer.currentfoot$.value
    foot.subtotal = subtotal
    this.footer.currentfoot$.next(foot)
    //foot.total = (subtotal + foot.shipping) - (foot.discount)
    //this.updateCurrent('footer', foot)

    //this.totales.emit(foot)
  }



  async saveInvoice(invoice: PurchaseInvoiceModel) {
    try {
      let businessRef = `businesses/${this._dashboard.CRF}`
      const invoiceRef = this._afs.doc<PurchaseInvoiceModel>(`${businessRef}/purchases/${invoice.invoiceId}`).ref
      invoiceRef.set({ ...invoice })

      let details: Invoice.concept[] = invoice.details
      details.forEach(async det => {
        let productRef = this._afs.doc(`${businessRef}/products/${det.product.UPC}`).ref
        await firebase.firestore().runTransaction(async transaction => {
          let store_Id = invoice.store.id
          const storeRef = productRef.collection('stores').doc(store_Id)
          let productStore = (await transaction.get(storeRef)).data()

          if (!productStore) {
            productStore = new StoreReferenceModel(store_Id, det.product.UPC, det.unit_cost)
          }
          productStore.stock = productStore.stock + det.cant

          await transaction.set(storeRef, { ...productStore }, { merge: true })
          const evento = new ProductEventModel(
            'purchase',
            this._dashboard.managerRef,
            invoiceRef
          )
          this._afs.collection(`${businessRef}/products/${det.product.UPC}/history`)
            .doc(`${new Date().getTime()}`)
            .set({ ...evento })
        })
      })

    } catch (error: any) {
      // this._alert.error('ha ocurrido un error al crear la factura', error)
      console.error(error);
    }
  }
}

// type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]
