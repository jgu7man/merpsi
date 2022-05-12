import { createDate, FireTime } from "src/app/models/firestore.model";
import { iInvoiceFooter, invoiceFooter, iProductInvoice } from "../invoices/invoice.model";

export class creditNoteModel{
  date_emition:FireTime = createDate(new Date())
  invoiceId:string
  noteId:string
  manager:string
  concept:string
  footer: iInvoiceFooter
  details: iProductInvoice[]
  constructor(
    invoiceId:string,
    noteId:string,
    manager:string,
    concept:string,
    footer:iInvoiceFooter,
    details: iProductInvoice[]
  )
  {
    this.invoiceId = invoiceId
    this.noteId = noteId
    this.manager = manager
    this.concept = concept
    this.footer = footer
    this.details = details
  }

}