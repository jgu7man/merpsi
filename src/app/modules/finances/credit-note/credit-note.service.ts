import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject } from 'rxjs';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { AuthService } from 'src/app/services/auth.service';
import { PersonalService } from '../../admin/managers/personal.service';
import { ProductEventModel } from '../../inventory/products/products.model';
import { FooterService } from '../invoices/footer-invoice/footer.service';
import { iInvoiceFooter, iProductInvoice } from '../invoices/invoice.model';
import { SalesInvoiceModel } from '../sales-invoices/sales-invoice.model';
import { TaxesService } from '../taxes/taxes.service';
import { CreditNoteModel } from './creditNote.model';
import { AppliedTaxModel, TaxModel } from '../taxes/taxes.model'

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService {

  businessCRF: string = this._cache.getDataKey('eid')!
  businessRef = `businesses/${this._dashboard.CRF}`
  public totales: EventEmitter<iInvoiceFooter> = new EventEmitter();
  currentNC$ = new BehaviorSubject<CreditNoteModel | null>(null)
  currentSales$ = new BehaviorSubject<SalesInvoiceModel | null>(null)
  taxes: AppliedTaxModel[] = [];


  constructor(
    private _alert: MxAlert,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    private _taxes: TaxesService,
    private _foot: FooterService,
    private _manager: PersonalService
  ) {
  }
  async saveCreditNote(creditNote: CreditNoteModel) {
    try {
      /**se guarda la nota de credito */

      const creditRef = this._afs.doc<CreditNoteModel>(`${this.businessRef}/credit_note/${creditNote.id}`).ref
      const managerRef = this._manager.managerRef
      const managerData = this._manager.current
      if (!managerData) throw { message: "No se ha iniciado sesion" }
      creditNote.manager = managerData.name
      creditRef.set({ ...creditNote })
      if (creditNote.concept == 'devolucion') {
        /* se  itera los conceptos para aplicar la devolucion */
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
              'return',
              managerRef,
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
  async recalculate(det: iProductInvoice, concept: string) {
    try {
      if (!this.currentNC$.value) throw { message: ' No existe el currentNC' }
      if (!this.currentSales$.value) throw { message: ' No existe el currentSales' }
      let details = this.currentNC$.value.details
      let foot = this.currentNC$.value.footer
      let subtotal = 0
      let total = 0
      if (concept == 'disminucion') {
        let taxe: TaxModel[] = []
        details.map(async d => {
          if ( d.UPC === det!.UPC  ) {
          let total_item = det.unit_cost * det.cant
          total +=  total_item
          let rate = 0
          this.taxes.forEach(tax => {
            rate +=  tax.rate
            taxe.push(new TaxModel(0, tax.name, tax.rate))
          })
          total_item = this.taxereverse(rate, total_item)
          subtotal += total_item

          details = details.map(d => {
            let details
            if (d.UPC === det!.UPC) {
              details = {
                ...det,
                unit_cost: total_item / det.cant,
                amount: total_item
              }
            }else{
              details = d
            }
            return details
          })
        }else{
          subtotal += d.amount
        }
          await this.updateCurrent('details', details)
        })
        taxe.forEach(t => {
          this._taxes.calcTax(t, subtotal!)
        })
        foot.taxes = this._taxes.applidedTaxes
        foot.totalTaxes = this._taxes.appliedTaxesTotal
        foot.subtotal = subtotal!
        foot.total = total
        foot.total = (subtotal + foot.shipping + foot.totalTaxes) - (foot.discount)
        this.updateCurrent('footer', foot)
        this._foot.currentfoot$.next(foot)

      } else {

        details = details.map(d => {
          let details
          if (d.UPC === det!.UPC) {
            d.amount = det.cant * det.unit_cost
            details = {
              ...det,
              amount: d.amount
            }
            subtotal += d.amount
          } else {
            details = d
            subtotal += d.amount
          }
          return details
        })
        console.log(details);
        await this.updateCurrent('details', details)
        let foot = this.currentNC$.value!.footer

        foot.subtotal = subtotal
        this.taxes.forEach(tax => {
          let taxe = new TaxModel(0, tax.name, tax.rate)
          this._taxes.calcTax(taxe, subtotal)
        })
        foot.taxes = this._taxes.applidedTaxes
        foot.totalTaxes = this._taxes.appliedTaxesTotal

        foot.total = (subtotal + foot.shipping + foot.totalTaxes) - (foot.discount)

        this.updateCurrent('footer', foot)
        this._foot.currentfoot$.next(foot)
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

  getFooter(foot: iInvoiceFooter, invoice: SalesInvoiceModel) {

    if (invoice) {
      let footer = invoice.footer
      let discount = foot.discount
      let shipping = foot.shipping
      footer.total = (footer.subtotal + shipping) - discount

      this._foot.currentfoot$.next(footer)
      // this.totales.emit(footer)
    }
  }

  updateCurrent(
    param: keyof CreditNoteModel,
    value: CreditNoteModel[typeof param]
  ) {
    if (this.currentNC$.value !== null) {
      this.currentNC$.next({
        ...this.currentNC$.value,
        [param]: value
      })
    }
  }

  async getInvoice(invoice_ID: string) {
    let invoiceRef = this._afs.doc<SalesInvoiceModel>(`${this.businessRef}/sale/${invoice_ID}`).ref
   if (this.currentNC$.value){
     this.currentNC$.value.invoiceRef = invoiceRef
   }
    let invoice = (await (invoiceRef.get())).data()
    return invoice || null
  }

  nextCurrent(invoice_Ref: SalesInvoiceModel | null) {
    if (invoice_Ref) {
      this.currentSales$.next(invoice_Ref)
      this.taxes = this.currentSales$.value!.footer.taxes
    }


  }

  taxereverse(rate: number, total: number) {
    try {
      if (total < 0) throw { message: ' el total debe ser mayor a 0' }
      return total / ((rate / 100) + 1)

    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return 0
    }
  }
}
