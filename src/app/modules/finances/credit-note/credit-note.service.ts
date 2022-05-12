import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject } from 'rxjs';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentProductService } from '../../inventory/product-single/current-product.service';
import { ProductEventModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { FooterService } from '../invoices/footer-invoice/footer.service';
import { iInvoiceFooter, iProductInvoice } from '../invoices/invoice.model';
import { SalesInvoiceModel } from '../sales-invoices/sales-invoice.model';
import { TaxesService } from '../taxes/taxes.service';
import { creditNoteModel } from './creditNote.model';

@Injectable({
  providedIn: 'root'
})
export class  CreditNoteService {
 
  businessCRF: string = this._cache.getDataKey('eid')!
  businessRef = `businesses/${this._dashboard.CRF}`
  public totales: EventEmitter<iInvoiceFooter> = new EventEmitter();
  currentNC$ = new BehaviorSubject<SalesInvoiceModel | null>(null)
  
  
  constructor(
    private auth: AuthService,
    private _alert: MxAlert,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    private manager: CurrentProductService,
    private _taxes: TaxesService,
    private foot: FooterService
  ) {

  }
  async saveCreditNote( creditNote: creditNoteModel) {
    try {
      /**se guarda la nota de credito */

      const creditRef = this._afs.doc<creditNoteModel>(`${this.businessRef}/creditNote/${creditNote.noteId}`).ref
      const managerRef = this.manager.managerRef
      const man = (await managerRef.get()).data()
      creditNote.manager = man!.name
     // creditNote.footer = this.currentNC$.value!.footer
      if (creditNote.concept == 'devolucion') {
        /* se  */
        creditNote.details.forEach(async det => {
          let productRef = this._afs.doc(`${this.businessRef}/products/${det.UPC}`).ref
          await firebase.firestore().runTransaction(async transaction => {
            let store_Id = det.store
            const storeRef = productRef.collection('stores').doc(store_Id)
            let productStore = (await transaction.get(storeRef)).data()
  
            if (productStore) {
              productStore.stock = productStore.stock + det.cant
            }
            await transaction.set(storeRef, { ...productStore }, { merge: true })
            /**Historial del producto */
            const evento = new ProductEventModel(
              'credit-note',
              this.manager.managerRef,
              creditRef
            )
            this._afs.collection(`${this.businessRef}/products/${det.UPC}/history`)
              .doc(`${new Date().getTime()}`)
              .set({ ...evento })
          })
        })
      } 
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }
  async recalculate(det: iProductInvoice){
  
    if (this.currentNC$.value){
      let details = this.currentNC$.value!.details
      let subtotal = 0
      details = details.map(d => {
        let details
        if (d.UPC === det!.UPC) {
          d.amount = det.cant * det.unit_cost
          details = {
            ...d,
            ...det
          }
          subtotal += d.amount
        }else{
          details = d
          subtotal += d.amount
        } 
        return details
      })
      console.log(details);
      await this.updateCurrent('details', details)
      let foot = this.currentNC$.value!.footer
      
      foot.subtotal = subtotal
      foot.taxes = []
      this._taxes.applidedTaxes = []
      foot.total = (subtotal + foot.shipping ) - (foot.discount)
      this.updateCurrent('footer', foot)
  
      //this.totales.emit(foot)
      this.foot.currentfoot$.next(foot)

    }
    
  }

  getFooter(foot: iInvoiceFooter, invoice: SalesInvoiceModel) {
   
      if (invoice) {
        let footer = invoice.footer
        let discount = foot.discount
        let shipping = foot.shipping
        footer.total = (footer.subtotal + shipping) - discount

        this.foot.currentfoot$.next(footer)
        // this.totales.emit(footer)
      }
    }

    updateCurrent(
      param: keyof SalesInvoiceModel,
      value: SalesInvoiceModel[typeof param]
    ) {
      if (this.currentNC$.value !== null) {
        this.currentNC$.next({
          ...this.currentNC$.value,
          [param]: value
        })
      }
    }

    async getInvoice(invoice_ID: string){
      let invoiceRef = this._afs.doc<SalesInvoiceModel>(`${this.businessRef}/sale/${invoice_ID}`).ref
      let invoice = (await (invoiceRef.get())).data()
      return invoice || null
    }

    nextCurrent(invoice_Ref: SalesInvoiceModel | null) {
      this.currentNC$.next(invoice_Ref)
    }
    

}
