import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { PersonalService } from '../../admin/managers/personal.service';
import { ProductEventModel } from '../../inventory/products/products.model';
import { FooterService } from '../invoices/footer-invoice/footer.service';
import { SalesInvoiceModel } from '../sales-invoices/sales-invoice.model';
import { TaxesService } from '../taxes/taxes.service';
import { CreditNoteModel, iCreditNote, NoteCredit, ProductNoteModel } from './creditNote.model';
import { AppliedTaxModel, TaxModel } from '../taxes/taxes.model'
import { Invoice, InvoiceFooter, ProductInvoiceModel } from '../invoices/invoice.model';
import { iStub } from '../stubs-invoice/stub.model';
import { FooterCreditoDebitoService } from '../invoices/footer-credito-debito/footer-credito-debito.service';
import { InvoiceConceptService } from '../invoices/invoice-concept/invoice-concept.service';
import { StubService } from '../stubs-invoice/stub.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService {

  businessCRF: string = this._cache.getDataKey('eid')!
  businessRef = `businesses/${this._dashboard.CRF}`
  public totales: EventEmitter<InvoiceFooter> = new EventEmitter();
  taxes: AppliedTaxModel[] = [];
  stubList$ = new BehaviorSubject<iStub[]>([])
  stubSelect$ = new BehaviorSubject<iStub | null>(null)


  constructor(
    private _alert: MxAlert,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    private _taxes: TaxesService,
    private _foot: FooterCreditoDebitoService,
    private invoiceConcept: InvoiceConceptService,
    private _manager: PersonalService,
    public stub: StubService,
    private _router: Router,


  ) {
  }
  async saveCreditNote(creditNote: CreditNoteModel) {
    try {
      /**se guarda la nota de credito */

      const creditRef = this._afs.doc<CreditNoteModel>(`${this.businessRef}/credit_notes/${creditNote.id}`).ref
      const managerRef = this._manager.managerRef
      const managerData = this._manager.current
      creditRef.set({ ...creditNote })
      if (creditNote.concept == 'devolucion') {
        /* se  itera los conceptos para aplicar la devolucion */
        creditNote.details.forEach(async det => {
          let productRef = this._afs.doc(`${this.businessRef}/products/${det.product.UPC}`).ref
          await firebase.firestore().runTransaction(async transaction => {
            let store_Id = det.store
            if (!store_Id) throw { message: 'no se encuentra la tienda del concepto ' }
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
            this._afs.collection(`${this.businessRef}/products/${det.product.UPC}/history`)
              .doc(`${new Date().getTime()}`)
              .set({ ...evento })
          })
        })
      }
      /**Se actualiza el index current en el talonario seleccionado */
      if (this.stubSelect$.value) {
        let stub = this.stubSelect$.value
        stub.currentIndex = stub.currentIndex + 1
        this.stub.update(stub)
      }
      Swal.fire('Guardado') 
      this._router.navigate([`business/${this.businessCRF}/finances/sales`])

    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }
  async recalculate(changes: { cant: number, unit_price: number }, det: ProductInvoiceModel | Invoice.concept) {
    try {
      if (!this.invoiceConcept.details_Notes$.value) throw { message: ' No existe el detalle' }
      if (!this._foot.footer$.value) throw { message: ' No existe el footer' }
      let details = this.invoiceConcept.details_Notes$.value
      let foot = this._foot.footer$.value
      let subtotal = 0
      let total = 0
      let taxe: TaxModel[] = []
      details.map(async d => {
        if (d.product.UPC === det!.product.UPC) {
          let total_item = changes.unit_price * changes.cant
          total += total_item
          let rate = 0
          foot.taxes.forEach(tax => {
            rate += tax.rate
            taxe.push(new TaxModel(0, tax.name, tax.rate))
          })
          total_item = this.taxereverse(rate, total_item)
          subtotal += total_item

          let calc = details.map(d => {
            let details: NoteCredit.concept
            if (d.product.UPC === det!.product.UPC) {
              details = {
                ...det,
                unit_price: total_item / det.cant!,
                amount: total_item
              }
            } else {
              details = d
            }
            return details
          })
          details = calc.map(d => {
            return new ProductNoteModel(d)
          })
        } else {
          subtotal += d.amount
        }
        this.invoiceConcept.details_Notes$.next(details)
      })
      taxe.forEach(t => {
        this._taxes.calcTax(t, subtotal!)
      })
      foot.taxes = this._taxes.applidedTaxes
      foot.subtotal = subtotal!
      this._foot.footer$.next(foot)


      console.log(this.invoiceConcept.details_Notes$.value);
      console.log(this._foot.footer$.value);


    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }

  }

  async getInvoice(invoice_ID: string) {
    let invoiceRef = this._afs.doc<SalesInvoiceModel>(`${this.businessRef}/sale/${invoice_ID}`).ref
    let invoice = (await (invoiceRef.get())).data()
    return invoice || null
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

  listCredits(): Observable<iCreditNote[]> {
    return this._afs.collection<iCreditNote>(`businesses/${this.businessCRF}/credit_notes/`).valueChanges()
      .pipe(
        map(result => {
          const credits: iCreditNote[] = []
          result.forEach(p => {
            credits.push(p);
          })
          return credits
        }),
        catchError(error => {
          console.error(error);
          Swal.fire('No se logró cargar la lista de notas de crédito', error);
          return of([]);
        })
      )
  }
}
