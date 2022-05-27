import { createDate, FireDoc, FireRef, FireTime } from "src/app/models/firestore.model";
import { Invoice, InvoiceFooter } from "../invoices/invoice.model";
import { SalesInvoiceModel } from "../sales-invoices/sales-invoice.model";

export class CreditNoteModel {
  date_emition: FireTime = createDate(new Date())
  invoiceId: string
  invoiceRef: FireRef<SalesInvoiceModel> | null = null
  id: string
  manager: string
  concept: string
  footer: InvoiceFooter
  details: Invoice.concept[]
  constructor(
    invoiceId: string,
    noteId: string,
    manager: string,
    concept: string,
    details: Invoice.concept[],
    footer: InvoiceFooter,
  ) {
    this.invoiceId = invoiceId
    this.id = noteId
    this.manager = manager
    this.concept = concept
    this.details = details
    this.footer = footer 
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
