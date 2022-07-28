import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { iPurchaseInvoice, PurchaseInvoiceModel } from 'src/app/modules/finances/purchase-invoices/pucharce-invoice.model';
import { Observable, of } from 'rxjs';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ProductEventModel, ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import firebase from 'firebase/app'
import { DetailsConceptService } from '../shared/invoice-details/invoice-details.service';
import { catchError, map } from 'rxjs/operators';
import { Invoice, InvoiceFooter, ProductInvoiceModel } from '../shared/invoice.model';
import { PersonalService } from '../../admin/managers/personal.service';
import { FormGroup } from '@angular/forms';
import { iProvider } from '../../inventory/providers/provider.model';
import { iSede } from '../../admin/stores/sede.model';
import { FooterService } from '../shared/footer-invoice/footer.service';
import { DatabasePathsService } from 'src/app/services/database-paths.service';
import { TaxesService } from '../shared/taxes/taxes.service';



@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {

  businessCRF: string = this._cache.getDataKey('eid')!
  public totales: EventEmitter<InvoiceFooter> = new EventEmitter();
  invoiceId: string = ''
  provider: iProvider | null = null
  store: iSede | null = null


  constructor(
    public _taxes: TaxesService,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    public footer: FooterService,
    public conceptInvoice: DetailsConceptService,
    private _footer: FooterService,
    private _manager: PersonalService,
    private _path: DatabasePathsService
  ) {
  }

  listPurchases(): Observable<PurchaseInvoiceModel[]> {
    return this._afs.collection<PurchaseInvoiceModel>(`${this._path.purchasesRef}/`).valueChanges()
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
    return foot
  }

  async findInvoice(invoiceId: string) {
    try {
      this.invoiceId = invoiceId
      const invoiceResult = await this._afs.doc<iPurchaseInvoice>(`${this._path.purchasesRef}/${invoiceId}`).ref.get()
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
    if (!this.footer.currentfoot$.value) throw { message: ' No existe el footer' }
    let foot = this.footer.currentfoot$.value
    foot.subtotal = subtotal
    this.footer.currentfoot$.next(foot)
    }



  async saveInvoice(invoiceForm: FormGroup) {
    try {
      if (!this.conceptInvoice.details$.value) throw { message: ' No existe los conceptos' }
      if (!this._footer.currentfoot$.value) throw { message: ' No existe el footer' }
      if (!this._manager.current) throw { message: 'No se ha iniciado la sesion' }
      if (!invoiceForm.valid) throw { message: 'debe llenar todos los campos del formulario' }
      if (!this.store) throw { message: 'debe seleccionar una sede' }
      if (!this.provider) throw { message: 'debe seleccionar un proveedor' }
      if (this.conceptInvoice.details$.value.length == 0) throw { message: 'debe agregar por lo menos un concepto' }
      if (this._footer.currentfoot$.value.total <= 0) throw { message: 'el total de la factura no debe ser igual o menor a cero ' }

      const manager: Invoice.manager = {
        id: this._manager.current.uid!,
        name: this._manager.current.name,
        ref: this._manager.managerRef
      }

      let { action_date, invoiceId } = invoiceForm.value

      const provider: Invoice.provider = {
        CRF: this.provider.CRF,
        name: this.provider.name,
        ref: null

      }

      const invoice = new PurchaseInvoiceModel(
        invoiceId,
        action_date,
        provider,
        this.store,
        this.conceptInvoice.details$.value,
        this._footer.currentfoot$.value.getdata(),
        '',
        '',
        manager
      )
      const invoiceRef = this._afs.doc<PurchaseInvoiceModel>(`${this._path.purchasesRef}/${invoice.invoiceId}`).ref
      invoiceRef.set({ ...invoice })

      let details: Invoice.concept[] = invoice.details
      details.forEach(async det => {
        let productRef = this._afs.doc(`${this._path.productsRef}/${det.product.UPC}`).ref
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
          this._afs.collection(`${this._path.purchasesRef}/${det.product.UPC}/history`)
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
