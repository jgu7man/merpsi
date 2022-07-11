import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { FireRef } from 'src/app/models/firestore.model';
import Swal from 'sweetalert2';
import { FooterService } from '../shared/footer-invoice/footer.service';
import { SalesInvoiceModel } from '../sales-invoices/sales-invoice.model';
import { iStub } from '../stubs-invoice/stub.model';
import { StubService } from '../stubs-invoice/stub.service';
import { AppliedTaxModel } from '../taxes/taxes.model';
import { TaxesService } from '../taxes/taxes.service';
import { DebitNoteModel, iDebitNote } from './debit-note.model';

@Injectable({
  providedIn: 'root'
})
export class DebitNoteService {
  stubSelect$ = new BehaviorSubject<iStub | null>(null)
  stubList$ = new BehaviorSubject<iStub[]>([])
  listTaxes: AppliedTaxModel[] = [];
  businessCRF = this._dashboard.CRF
  businessRef = `businesses/${this.businessCRF}`


  constructor(
    public taxes: TaxesService,
    public foot: FooterService,
    private _alert: MxAlert,
    private _dashboard: DashboardService,
    private _afs: AngularFirestore,
    private stub: StubService,
  ) { }

  async getInvoice(invoice_ID: string) {
    let invoiceRef = this.getInvoiceRef(invoice_ID)
    let invoice = (await (invoiceRef.get())).data()
    return invoice || null
  }

  getInvoiceRef(invoice_ID: string): FireRef<SalesInvoiceModel> {
    return this._afs.doc<SalesInvoiceModel>(`${this.businessRef}/sales/${invoice_ID}`).ref
  }

  saveDebitNote(debit: DebitNoteModel) {

    const creditRef = this._afs.doc(`${this.businessRef}/debit_notes/${debit.id}`).ref
    let data = {
      ...debit,
      footer: { ...debit.footer }
    }
    console.log(data);

    creditRef.set(data)

    /**Se actualiza el index current en el talonario seleccionado */
    if (this.stubSelect$.value) {
      let stub = this.stubSelect$.value
      stub.currentIndex = stub.currentIndex + 1
      this.stub.update(stub)
    }


  }

  listDebits(): Observable<iDebitNote[]> {
    return this._afs.collection<iDebitNote>(`${this.businessRef}/debit_notes/`).valueChanges()
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

}
