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
import { SalesInvoiceModel, SalesInvoiceReadingModel } from '../sales-invoices/sales-invoice.model';
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
  taxes: AppliedTaxModel[] = [];
  stubList$ = new BehaviorSubject<iStub[]>([])
  stubSelect$ = new BehaviorSubject<iStub | null>(null)
  invoiceRef$ = new BehaviorSubject<SalesInvoiceModel | null>(null)


  constructor(
    public stub: StubService,
    private _alert: MxAlert,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    private _taxes: TaxesService,
    private _foot: FooterCreditoDebitoService,
    private invoiceConcept: InvoiceConceptService,
    private _manager: PersonalService,


  ) {
  }
  async saveCreditNote(creditNote: CreditNoteModel) {
    try {
      /**se guarda la nota de credito */

      const creditRef = this._afs.doc<CreditNoteModel>(`${this.businessRef}/credit_notes/${creditNote.id}`).ref
      const managerRef = this._manager.managerRef
      creditRef.set({ ...creditNote })
      if (creditNote.context == 'devolucion') {
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
    let invoiceRef = this._afs.doc<SalesInvoiceModel>(`${this.businessRef}/sales/${invoice_ID}`).ref
    let invoice = (await (invoiceRef.get())).data()
    if (invoice){
      this.invoiceRef$.next(invoice)
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

  async findNoteCredits(invoice: SalesInvoiceReadingModel) {
    console.log(invoice);
    
    if (invoice.avalibleAmount == 0){
      return false
    } else {
      return true
    }
    // const notesRef = await this.getnotesByid(invoice.invoiceId)
    // const result = notesRef.docs
    // let notes_result = result.map((doc) => {
    //   return doc.data()
    // })
    // let totales = notes_result.reduce((acc, item) => acc + item.footer.total, 0)
    // if (totales >= invoice.footer.total) {
    //   return false
    // } else {
    //   return true
    // }
  }
}
