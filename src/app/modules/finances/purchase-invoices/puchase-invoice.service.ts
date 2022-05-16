import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { iInvoice, PurchaseInvoiceModel } from 'src/app/modules/finances/purchase-invoices/pucharce-invoice.model';
import { BehaviorSubject } from 'rxjs';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ProductEventModel, ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { iInvoiceFooter, InvoiceFooterModel, iProductInvoice, ProductInvoiceModel } from '../invoices/invoice.model';
import { TaxesService } from '../taxes/taxes.service';
import { txn } from 'src/app/models/firestore.model';
import { StoreReference } from 'src/app/modules/inventory/products/products.model';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentProductService } from '../../inventory/product-single/current-product.service';
import firebase from 'firebase/app'
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';



@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {


  current$ = new BehaviorSubject<PurchaseInvoiceModel | null>(null)
  businessCRF: string = this._cache.getDataKey('eid')!
  public totales: EventEmitter<iInvoiceFooter> = new EventEmitter();


  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    public _taxes: TaxesService,
    private _dashboard: DashboardService,
    private manager: CurrentProductService,
    private _alert: MxAlert,


  ) {
  }

  create() {

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

  deleteConcept(UPC: string) {

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
        details: this.current$.value.details!.filter(c => c.UPC !== UPC)
      })
      let foot = this.calcFooter()
      this.totales.emit(foot)
    }
  }

  calcFooter() {
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
    value: PurchaseInvoiceModel[typeof param]
  ) {
    if (this.current$.value !== null) {
      this.current$.next({
        ...this.current$.value,
        [param]: value
      })
    }
  }

  async findInvoice(invoiceId: string) {
    try {

      const invoiceResult = await this._afs.doc<iInvoice>(`businesses/${this.businessCRF}/purchases/${invoiceId}`).ref.get()
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
    if (this.current$.value != null) {
      let details: iProductInvoice[] = this.current$.value.details
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
    await this.updateCurrent('details', details)
    let foot = this.current$.value!.footer
    foot.subtotal = subtotal
    foot.total = (subtotal + foot.shipping) - (foot.discount)
    this.updateCurrent('footer', foot)

    this.totales.emit(foot)
  }

  getFooter(changes: InvoiceFooterModel) {
    if (this.current$.value != null) {
      let footer = this.current$.value.footer
      let discount = changes.discount
      let shipping = changes.shipping
      footer.total = (footer.subtotal + shipping) - discount
      this.updateCurrent('footer', { ...footer, discount: discount, shipping: shipping }
      )
      this.totales.emit(footer)
    }
  }

  async saveInvoice(invoice: PurchaseInvoiceModel) {
    try {
      let businessRef = `businesses/${this._dashboard.CRF}`
      if (this.current$.value) {
        const invoiceRef = this._afs.doc<PurchaseInvoiceModel>(`${businessRef}/purchase/${this.current$.value.invoice_ID}`).ref
        invoiceRef.set({ ...invoice })

        let details: iProductInvoice[] = this.current$.value.details
        details.forEach(async det => {
          let productRef = this._afs.doc(`${businessRef}/products/${det.UPC}`).ref
          await firebase.firestore().runTransaction(async transaction => {
            let store_Id = this.current$.value!.store.id
            const storeRef = productRef.collection('stores').doc(store_Id)
            let productStore = (await transaction.get(storeRef)).data()

            if (!productStore) {
              productStore = new StoreReferenceModel(store_Id, det.UPC, det.unit_cost)
            }
            productStore.stock = productStore.stock + det.cant

            await transaction.set(storeRef, { ...productStore }, { merge: true })
            const evento = new ProductEventModel(
              'purchase',
              this.manager.managerRef,
              invoiceRef
            )
            this._afs.collection(`${businessRef}/products/${det.UPC}/history`)
              .doc(`${new Date().getTime()}`)
              .set({ ...evento })
          })
        })
      }
    } catch (error: any) {
      this._alert.error('ha ocurrido un error al crear la factura', error)
      console.error(error);
    }
  }
}

// type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]