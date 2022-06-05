import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { BehaviorSubject } from 'rxjs';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { FireRef } from 'src/app/models/firestore.model';
import { PersonalService } from '../../admin/managers/personal.service';
import { FooterService } from '../invoices/footer-invoice/footer.service';
import { InvoiceFooter, ProductInvoiceModel } from '../invoices/invoice.model';
import { SalesInvoiceModel } from '../sales-invoices/sales-invoice.model';
import { iStub } from '../stubs-invoice/stub.model';
import { AppliedTaxModel, TaxModel } from '../taxes/taxes.model';
import { TaxesService } from '../taxes/taxes.service';
import { DebitNoteModel } from './debit-note.model';

@Injectable({
  providedIn: 'root'
})
export class DebitNoteService {
  stubSelect$= new BehaviorSubject<iStub | null>(null)
  stubList$= new BehaviorSubject<iStub[] >([])
  listTaxes: AppliedTaxModel[] = [];
  businessRef = `businesses/${this._dashboard.CRF}`
  
  
  constructor(
    public taxes: TaxesService,
    public foot: FooterService,
    private _alert: MxAlert,
    private _dashboard: DashboardService,
    private _afs: AngularFirestore
  ) { }

  updatedetails(param: keyof ProductInvoiceModel,
    value: ProductInvoiceModel[typeof param]) {
    throw new Error('Method not implemented.');
  }

  async getInvoice(invoice_ID: string) {
    let invoiceRef = this.getInvoiceRef(invoice_ID)
    let invoice = (await (invoiceRef.get())).data()
    return invoice || null
  }

  getInvoiceRef( invoice_ID: string ):FireRef<SalesInvoiceModel>{
    return this._afs.doc<SalesInvoiceModel>(`${this.businessRef}/sale/${invoice_ID}`).ref
  }

  saveDebitNote(debit: DebitNoteModel) {
    
    const creditRef = this._afs.doc(`${this.businessRef}/debit_note/${debit.id}`).ref
    let data= { 
      ...debit,
      footer: {...debit.footer}
    }
    console.log(data);
    
    creditRef.set(data)

  }

}
