import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { FireRef } from 'src/app/models/firestore.model';
import Swal from 'sweetalert2';
import { iSalesInvoice, SalesInvoiceModel, SalesInvoiceReadingModel } from '../sales-invoices/sales-invoice.model';
import { iStub } from '../stubs-invoice/stub.model';
import { StubService } from '../stubs-invoice/stub.service';
import { AppliedTaxModel, TaxModel } from '../taxes/taxes.model';
import { TaxesService } from '../taxes/taxes.service';
import { DebitNoteModel, iDebitNote } from './debit-note.model';
import { FooterNoteModel } from '../credit-note/creditNote.model';
import { DetailsConceptService } from '../shared/invoice-details/invoice-details.service';
import { FooterCreditoDebitoService } from '../shared/footer-note/footer-notes.service';
import { PersonalService } from '../../admin/managers/personal.service';
import { Invoice } from '../shared/invoice.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreditDebitNoteDialogComponent } from '../sales-invoices/create-invoice-sales/credit-debit-note.dialog/credit-debit-note.dialog.component';
import { MatSelectChange } from '@angular/material/select';
import { FooterService } from '../shared/footer-invoice/footer.service';
import { DatabasePathsService } from 'src/app/services/database-paths.service';

@Injectable({
  providedIn: 'root'
})
export class DebitNoteService {
  stubSelect$ = new BehaviorSubject<iStub | null>(null)
  stubList$ = new BehaviorSubject<iStub[]>([])
  listTaxes: AppliedTaxModel[] = [];
  businessCRF = this._dashboard.CRF
  businessRef = `businesses/${this.businessCRF}`
  invoice_Ref: SalesInvoiceModel | null = null;
  origin: string | null = null;


  constructor(
    public taxes: TaxesService,
    public foot: FooterService,
    public footer: FooterCreditoDebitoService,
    public manager: PersonalService,
    public invoiceConcept: DetailsConceptService,
    private _alert: MxAlert,
    private _dashboard: DashboardService,
    private _afs: AngularFirestore,
    private _stub: StubService,
    private _dialog: MatDialog,
    private _router: Router,
    private _path: DatabasePathsService


  ) { }

  async getInvoice(invoice_ID: string) {
    let invoiceRef = this.getInvoiceRef(invoice_ID)
    let invoice = (await (invoiceRef.get())).data()
    this.invoice_Ref = invoice || null
  }

  getInvoiceRef(invoice_ID: string): FireRef<SalesInvoiceModel> {
    return this._afs.doc<SalesInvoiceModel>(`${this._path.salesRef}/${invoice_ID}`).ref
  }

  seletedStub(data: MatSelectChange) {
    try {
      this.stubSelect$.next(data.value)
      if (!this.stubSelect$.value) throw { message: ' No existe el talonario' }
      let stub = this.stubSelect$.value
      stub.prefixIndexCurrent = stub.prefix + ((stub.currentIndex || 0) + 1)
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }

  }

  saveDebitNote() {
    try {
      if (!this.manager.current) throw { message: 'No se ha iniciado la sesion' }
    if (!this.invoiceConcept.details_Notes$.value) throw { message: 'No existe el detalle' }
    if (!this.footer.footer$.value) throw { message: 'No existe el footer' }
    if (!this.invoice_Ref) throw { message: 'No existe la factura de referencia' }
    if (!this.stubSelect$.value) throw { message: 'No existe el talonario' }

    if (this.footer.footer$.value.total > 0) {
      const manager: Invoice.manager = {
        id: this.manager.current.uid!,
        name: this.manager.current.name,
        ref: this.manager.managerRef
      }

      const debit: DebitNoteModel = new DebitNoteModel(
        this.invoice_Ref.invoiceId,
        this.stubSelect$.value.prefixIndexCurrent,
        manager,
        this.invoiceConcept.details_Notes$.value,
        this.footer.footer$.value
      )
      const creditRef = this._afs.doc(`${this._path.debitNoteRef}/${debit.id}`).ref
      let data = {
        ...debit,
        footer: { ...debit.footer }
      }
      creditRef.set(data)

      /**Se actualiza el index current en el talonario seleccionado */
      if (this.stubSelect$.value) {
        let stub = this.stubSelect$.value
        stub.currentIndex = stub.currentIndex + 1
        this._stub.update(stub)
      }

      this._alert.notify('La Nota de debito ha sido guardado con exito!')

      if (this.origin != 'creation') {
        this._router.navigate([`business/${this.businessCRF}/finances/sales`])
      }
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

  listDebits(): Observable<iDebitNote[]> {
    return this._afs.collection<iDebitNote>(`${this._path.debitNoteRef}/`).valueChanges()
      .pipe(
        map(result => {
          const credits: iDebitNote[] = []
          result.forEach(p => {
            credits.push(p);
          })
          return credits
        }),
        catchError(error => {
          console.error(error);
          Swal.fire('No se logró cargar la lista de notas de debito', error);
          return of([]);
        })
      )
  }

  get nroInvoice(){
    return this.stubSelect$.value ? this.stubSelect$.value.prefixIndexCurrent : ''
  }

  setFooter() {
    try {
      if (!this.invoice_Ref) throw { message: 'No se encontro la factura' }
    let footer_tax = this.invoice_Ref.footer.taxes
        let taxs: TaxModel[] = footer_tax.map(tax => { return new TaxModel(0, tax.name, tax.rate) })
        let det = this.invoiceConcept.details_Notes$.value
        let amount = det.reduce((acc, item) => acc + item.amount, 0)
        let amount_tax = 0
        taxs.map(tax => {
          amount_tax = amount_tax + (new AppliedTaxModel(tax, amount)).amount
        })
        amount = amount + amount_tax
        this.footer.footer$.next(new FooterNoteModel(this.invoice_Ref.footer, this.invoiceConcept.details_Notes$.value, amount, taxs))
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }

  getValue(invoice: iSalesInvoice){
    try {
      if (!this.businessCRF)  throw { message: 'No Se ha iniciado sesion'}
      let invoice_reading = new SalesInvoiceReadingModel(invoice,this.businessCRF)
      this._dialog.open(
        CreditDebitNoteDialogComponent,{
          width: '1200px',
          height: '400px',
          data: {
            document: 'debit',
            invoice:  invoice_reading,
            origin: 'creation'
          }
      }).afterClosed().subscribe( data =>{
        // this.invoiceId = data.invoiceId
        this.origin = data.origin
        this.invoice_Ref = invoice  
        this.setFooter()      
      })
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
