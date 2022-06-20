import { createDate, FireRef, FireTime } from "src/app/models/firestore.model"
import { Manager } from "../../admin/managers/manager.model"
import { FooterNoteModel, NoteCredit, ProductNoteModel } from "../credit-note/creditNote.model"
import { Invoice, InvoiceFooter, ProductInvoiceModel } from "../invoices/invoice.model"
// import { iInvoiceFooter, iProductInvoice } from "../invoices/invoice.model"
import { SalesInvoiceModel } from "../sales-invoices/sales-invoice.model"

export class DebitNoteModel {
  emition_date: FireTime = createDate(new Date())
  id: string
  manager: Invoice.manager
  footer: NoteCredit.footer
  details: NoteDebit.concept[]
  constructor(
    public invoiceId: string,
    id: string,
    manager: Invoice.manager,
    details: ProductNoteModel[],
    footer: FooterNoteModel,
  ) {
    this.id = id
    this.manager = manager
    this.details = details.map(details => {
      return details.getdata()
    })
    this.footer = footer.getdata()
  }
}

export declare namespace NoteDebit {
  interface concept extends Omit<ProductNoteModel, 'getdata'> { }
  interface footer extends Omit<FooterNoteModel, 'data' | 'getdata' | 'totalInvoice' | 'calcTaxes' > { }

  interface invoice{
    id: string
    ref: FireRef<SalesInvoiceModel> | null

  }


}

export interface iDebitNote extends DebitNoteModel{}
