import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { MxAlert, MxCache } from '@marxa/devkit';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { PersonalService } from '../../admin/managers/personal.service';
import { ProductEventModel } from '../../inventory/products/products.model';
import { iSalesInvoice, SalesInvoiceModel, SalesInvoiceReadingModel } from '../sales-invoices/sales-invoice.model';
import { CreditNoteModel, FooterNoteModel, iCreditNote, NoteCredit } from './creditNote.model';
import { iStub } from '../shared/stubs/stub.model';
import { FooterCreditoDebitoService } from '../shared/footer-note/footer-notes.service';
import { DetailsConceptService } from '../shared/invoice-details/invoice-details.service';
import Swal from 'sweetalert2';
import { catchError, map } from 'rxjs/operators';
import { Invoice } from '../shared/invoice.model';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { CreditDebitNoteDialogComponent } from '../sales-invoices/create-invoice-sales/credit-debit-note.dialog/credit-debit-note.dialog.component';
import { DatabasePathsService } from 'src/app/services/database-paths.service';
import { StubService } from '../shared/stubs/stub.service';
import { AppliedTaxModel, TaxModel } from '../shared/taxes/taxes.model';

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
  contextNC?: NoteCredit.context
  invoiceId: string | null = null
  origin: string | null = null


  constructor(
    public stub: StubService,
    private _alert: MxAlert,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _dashboard: DashboardService,
    private _manager: PersonalService,
    private _invoiceConcept: DetailsConceptService,
    private _footer: FooterCreditoDebitoService,
    private _router: Router,
    private _dialog: MatDialog,
    private _path: DatabasePathsService
  ) {
  }
  async saveCreditNote() {
    try {
      if ( !this.stubSelect$.value ) throw { message: ' No existe el talonario' }
      if ( !this._footer.footer$.value ) throw { message: ' No existe el footer' }
      if ( !this.invoiceRef$.value ) throw { message: ' No existe la factura de referencia' }
      if ( !this._manager.current ) throw { message: 'No se ha iniciado la sesion' }
      if ( !this.contextNC ) throw { message: 'No se ha definido el contexto de la factura' }

      if (this._footer.footer$.value.total > 0) {
        if (this._footer.footer$.value.total <= this.invoiceRef$.value.footer.total) {
          const manager: Invoice.manager = {
            id: this._manager.current.uid!,
            name: this._manager.current.name,
            ref: this._manager.managerRef
          }
          let creditNote = new CreditNoteModel(
            this.invoiceRef$.value.invoiceId,
            this.stubSelect$.value.prefixIndexCurrent,
            manager,
            this.contextNC,
            this._invoiceConcept.details_Notes$.value,
            this._footer.footer$.value
          )
      /**se guarda la nota de credito */

      const creditRef = this._afs.doc<CreditNoteModel>(`${this._path.creditNoteRef}/${creditNote.id}`).ref
      const managerRef = this._manager.managerRef
      creditRef.set({ ...creditNote })
      if (creditNote.context == 'devolucion') {
        /* se  itera los conceptos para aplicar la devolucion */
        creditNote.details.forEach(async det => {
          let productRef = this._afs.doc(`${this._path.productsRef}/${det.product.UPC}`).ref
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
            this._afs.collection(`${this._path.productsRef}/${det.product.UPC}/history`)
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
          if( origin == 'invoice' ){
            this._router.navigate([`business/${this.businessCRF}/finances/sales`])
          
          } 

        } else {
          Swal.fire(`El total de la Nota de Credito no puede ser mayor a ${this.invoiceRef$.value.footer.total}`)
        }
      } else {

        Swal.fire(`El total de la Nota de Credito no puede ser 0.00`)
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
    let invoiceRef = this._afs.doc<SalesInvoiceModel>(`${this._path.salesRef}/${invoice_ID}`).ref
    let invoice = (await (invoiceRef.get())).data()
    if (invoice){
      this.invoiceRef$.next(invoice)
    }
  }

  listCredits(): Observable<iCreditNote[]> {
    return this._afs.collection<iCreditNote>(`${this._path.creditNoteRef}/`).valueChanges()
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
    if (invoice.avalibleAmount == 0) {
      return false
    } else {
      return true
    }
  }

  get nroStub(){
      return this.stubSelect$.value ? this.stubSelect$.value.prefixIndexCurrent : ''
  }

  setFooter(contextNC: string) {
    try {
      if (!this.invoiceRef$.value) throw { message: 'No Existe la factura relacionada' }

      /* se obtienen los impuestos colocados en la factura para aplicarselos al concepto de la Nota de credito*/
      let footer_tax = this.invoiceRef$.value.footer.taxes
      let taxe: TaxModel[] = footer_tax.map((tax: { name: string; rate: number; }) => { return new TaxModel(0, tax.name, tax.rate) })

      if (contextNC == 'disminucion') {
        let det = this._invoiceConcept.details_Notes$.value
        /* se calcula el subtotal de los detalles de la nota de credito */
        let amount = det.reduce((acc, item) => acc + item.amount, 0)
        let amount_tax = 0
        /* se calcula el monto total de los impuestos y se le suma al subtotal para sacar el total de los conceptos de la factura
        y poder aplicar la formula de (totalFactura - total de conceptos) = 0  */
        taxe.map(tax => { amount_tax = amount_tax + (new AppliedTaxModel(tax, amount)).amount })
        amount = amount + amount_tax


        const foot = new FooterNoteModel(this.invoiceRef$.value.footer, det, amount, taxe)
        this._footer.footer$.next(foot)
      } else {
        const foot = new FooterNoteModel(this.invoiceRef$.value.footer, this._invoiceConcept.details_Notes$.value, null, taxe)
        this._footer.footer$.next(foot)
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

  selectStub(data: MatSelectChange) {
    try {
      this.stubSelect$.next(data.value)
    if (!this.stubSelect$.value) throw { message: ' No existe el talonario' }
    let stub = this.stubSelect$.value
    stub.prefixIndexCurrent = stub.prefix + '-' + ((stub.currentIndex || 0) + 1)
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }


  async getValue(invoice: iSalesInvoice) {
    try {
      const invoice_reading = new SalesInvoiceReadingModel(invoice, this.businessCRF)

      let valid = await this.findNoteCredits(invoice_reading!)
      if (valid) {
        this._dialog.open(
          CreditDebitNoteDialogComponent, {
          width: '1200px',
          height: '400px',
          data: {
            document: 'credit',
            invoice: invoice_reading,
            origin: 'creation'
          }
        }).afterClosed().subscribe(data => {
          this.contextNC = data.tipo
          this.invoiceId = data.invoiceId
          this.origin = data.origin
          this.invoiceRef$.next(invoice)
          this.setFooter(data.tipo)

        })
      } else {
        Swal.fire('No se puede aplicar mas notas de credito a esta factura')
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

}
