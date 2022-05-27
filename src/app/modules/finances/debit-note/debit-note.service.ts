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
import { AppliedTaxModel, TaxModel } from '../taxes/taxes.model';
import { TaxesService } from '../taxes/taxes.service';
import { DebitNoteModel } from './debit-note.model';

@Injectable({
  providedIn: 'root'
})
export class DebitNoteService {
  
  details$ = new BehaviorSubject<ProductInvoiceModel[] | null>(null)
  footer$ = new BehaviorSubject<InvoiceFooter | null>(null)
  listTaxes: AppliedTaxModel[] = [];
  businessRef = `businesses/${this._dashboard.CRF}`
  
  
  constructor(
    public taxes: TaxesService,
    public foot: FooterService,
    private _alert: MxAlert,
    private _dashboard: DashboardService,
    private _afs: AngularFirestore
  ) { }

  async recalculate(det: ProductInvoiceModel) {
  try {
    // if ( !this.details$.value ) throw { message: ' No existe el details '}
    // if ( !this.footer$.value ) throw { message: ' No existe el footer '}

    // let details = this.details$.value
    // let foot = this.footer$.value
    // this.listTaxes = foot.taxes
    // let subtotal = 0
    // let total = 0

    // details = details.map(d => {
    //   let details
    //   if (d.UPC === det!.UPC) {
    //     d.amount = det.cant * det.unit_cost
    //     details = {
    //       ...det,
    //       amount: d.amount
    //     }
    //     subtotal += d.amount
    //   } else {
    //     details = d
    //     subtotal += d.amount
    //   }
    //   return details
    // })
    // console.log(details)
    // this.details$.next(details)

    // foot.subtotal = subtotal
    // this.listTaxes.forEach(tax => {
    //   let taxe = new TaxModel(0, tax.name, tax.rate)
    //   this.taxes.calcTax(taxe, subtotal)
    // })
    // foot.taxes = this.taxes.applidedTaxes
    // foot.totalTaxes = this.taxes.appliedTaxesTotal

    // foot.total = (subtotal + foot.shipping + foot.totalTaxes) - (foot.discount)

    // this.footer$.next(foot)
    // this.foot.currentfoot$.next(foot)
  } catch (error: any) {
    if ('message' in error) {
      this._alert.error(error.message, error)
    } else {
      this._alert.error('mensaje de error', error)
    }
    return console.error(error)
  }

}
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
