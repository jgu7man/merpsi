import { createDate, FireDoc, FireTime } from "src/app/models/firestore.model";
import { iInvoiceFooter, InvoiceFooterModel, iProductInvoice } from "../invoices/invoice.model";
import { SalesInvoiceModel } from "../sales-invoices/sales-invoice.model";

export class CreditNoteModel {
  date_emition: FireTime = createDate(new Date())
  invoiceId: string
  // invoiceRef: FireDoc<SalesInvoiceModel>
  noteId: string
  manager: string
  concept: string
  footer: iInvoiceFooter
  details: iProductInvoice[]
  constructor(
    invoiceId: string,
    noteId: string,
    manager: string,
    concept: string,
    details: iProductInvoice[],
    footer?: iInvoiceFooter,
  ) {
    this.invoiceId = invoiceId
    this.noteId = noteId
    this.manager = manager
    this.concept = concept
    this.details = details
    this.footer = footer ? footer : footerEmpty
  }

}

const footerEmpty = {
  subtotal: 0,
  discount: 0,
  taxes: [],
  totalTaxes: 0,
  shipping: 0,
  total: 0,
}
